import validator from 'validator';
import User from '../models/user.model.js';
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';
import Doctor from '../models/doctor.model.js';
import Appointment from '../models/appointment.model.js';
import razorpay from 'razorpay'; // Import Razorpay for payment processing
//not generate the token at the time of registration
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Please provide all required fields");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Invalid email format");
    }
    //passwrod strong validation with lenght
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    })) {
        throw new ApiError(400, "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists with this email");
    }

    const user={
        name,
        email,
        password
    }
    const newUser = new User(user);
    await newUser.save();
    //generate the access token 
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      
    res.status(201).json(new ApiResponse("User registered successfully", {user: newUser, token}));
})

const loginUser= asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please provide all required fields");
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid email or password");
    }

    //generate the access token 
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    res.status(200).json(new ApiResponse(200,{token},"User logged in successfully",));
})

//get the user profile
const getUserProfile = asyncHandler(async (req, res) => {
    const {userId} = req; // Assuming you have middleware to set req.user
    console.log("User ID from request:", userId);
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200,user,"User profile fetched successfully"));
})

//update the user profile 
const updateUserProfile=asyncHandler(async(req,res)=>{
    //get the data from the req.body also a image so use the multer 
    const {name,email,phone,address,dob,gender}=req.body
   
    const imageLocalPath=req.file?.path
    const {userId} = req// Assuming you have middleware to set req.user
    if (!name || !email || !phone || !address || !dob || !gender){
        throw new ApiError(400, "Please provide all required fields");
    }
    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Invalid email format");
    }
    //passwrod strong validation with length
    //upload on the clodinary and make sure to save the url in the database
    if(imageLocalPath){
        const cloudinaryResponse = await uploadOnCloudinary(imageLocalPath);
        if (!cloudinaryResponse) {
            throw new ApiError(500, "Failed to upload image");
        }
        //get the url from the response
        req.body.image = cloudinaryResponse.url;    

    }   
    //now update the user profile with the given data so use the patch
    const updatedUser = await User.findByIdAndUpdate(userId, {name,phone,address,...(req.body?.image&&{image:req.body.image}),gender,email,dob}, { new: true, runValidators: true }).select("-password");
    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200,updatedUser,"User profile updated successfully"));
})  

//API to book appointment 
const bookAppointment = asyncHandler(async (req, res) => {
    const { userId } = req; // Assuming you have middleware to set req.user
    //now we will get the 4 things from the frontend 
    //{docId, slotDate, slotTime, amount};
    const { docId, slotDate, slotTime} = req.body;
    //validation wil be done here also
    //after this fetch the user and doctor from the id   
    //and the time into suited fromat
    //then add the slot time for the user and doctor also add the functionalities to check the slot is available or not
    if (!docId || !slotDate || !slotTime) {
        throw new ApiError(400, "Please provide all required fields");
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {    
        throw new ApiError(404, "User not found");
    }
    let doctor = await Doctor.findById(docId).select("-password");
    if (!doctor) {
        throw new ApiError(404, "Doctor not found");
    }
    if(!doctor.available){
        throw new ApiError(400, "Doctor is not available for appointment");
    }
    
    //get the slots_booked  from the doctor 
    let slotsBooked = doctor.slots_Booked || {};
    console.log("Slots booked before checking:", slotsBooked);
    //now check the current date is have or not for this first make an format in which it is stored in the model
    const currentDate = new Date(slotDate);
    const month = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript
    const day = currentDate.getDate();
    const year = currentDate.getFullYear(); 
    const format=`${day}-${month}-${year}`;
    //check the slot is not available is available or not
    if( !slotsBooked[format]) {
        slotsBooked[format] = []; // Initialize if not present
        //now push the slot time in to the slotsBooked
        slotsBooked[format].push(slotTime);
    }
    //date is present but slot time is also present
    else if( slotsBooked[format] && slotsBooked[format].includes(slotTime)) {
        throw new ApiError(400, "This slot is already booked");
    }
    else {
        slotsBooked[format].push(slotTime); // Add the new slot time
    }
    console.log("Slots booked after checking:", slotsBooked);
    //now update the doctor model and appointment model also 
    const appointment = {
        userId: userId,
        docId: docId,
        slotDate: format,
        slotTime: slotTime,
        amount: doctor.fees, // Initial status
        date: new Date(), // Current timestamp
    };

    const  newAppointment = new Appointment(appointment);
    await newAppointment.save();
     
   // Remove the slots_Booked field from the doctor object before sending it in the response
    //now update the doctor model with the slotsBooked
    doctor.slots_Booked = slotsBooked;  
    //console.log("Updated doctor slots_Booked:", doctor);
    doctor.markModified("slots_Booked");
    await doctor.save()
    .then((doc) => {
        console.log("Doctor slots_Booked updated successfully",doc);
    }).catch((error) => {
        console.error("Error updating doctor slots_Booked:", error);
    });
    res.status(201).json(new ApiResponse(201, newAppointment, "Appointment booked successfully"));

     

})

//API to list the all thw appointments
const listAppointments = asyncHandler(async (req, res) => {
    const { userId } = req; // Assuming you have middleware to set req.user
    //now find the appointments from the userId
    const appointments=await Appointment.find({userId}).populate('docId',"-password -__v").sort({date:-1});
    if(!appointments) {
        throw new ApiError(404, "No appointments found for this user");
    }
    res.status(200).json(new ApiResponse(200, appointments, "Appointments fetched successfully"));
})

//API to cancel the appointment
 const cancelAppointment = asyncHandler(async (req, res) => {
    const { userId } = req; // Assuming you have middleware to set req.user
    const { appointmentId } = req.body;
    
    if (!appointmentId) {
        throw new ApiError(400, "Please provide appointment ID");
    }
    //now find the appointment by the id and user id then update the appointment as the canceeld tue and in the docotr model als 
    //in the doctor model we will remove the slot from the slotsBooked
    
    const appointment = await Appointment.findOne(
        { _id: appointmentId },
    );
    if (!appointment || appointment.userId.toString() !== userId) {
        throw new ApiError(404, "Appointment not found or you do not have permission to cancel it");
    } 

    const doctor = await Doctor.findById(appointment.docId);
    if (!doctor) {
        throw new ApiError(404, "Doctor not found for this appointment");
    }
    console.log(appointment);
    //now update the appointment as cancelled
    appointment.cancelled = true;
    appointment.isCompleted = false; // Assuming you want to mark it as not completed
    await appointment.save();
    console.log("Appointment cancelled:", appointment);
    //now update the doctor model also
    //for the slottime and slotDate we will remove the slot from the slotsBooked
    const slotDate = appointment.slotDate;
    const slotTime = appointment.slotTime;
    if (doctor.slots_Booked && doctor.slots_Booked[slotDate]) {
        // Remove the slotTime from the slotsBooked
        doctor.slots_Booked[slotDate] = doctor.slots_Booked[slotDate].filter(time => time !== slotTime);
        // If no slots are left for that date, delete the date entry
        if (doctor.slots_Booked[slotDate].length === 0) {
            delete doctor.slots_Booked[slotDate];
        }
        doctor.markModified("slots_Booked");
        await doctor.save();
    } 




    res.status(200).json(new ApiResponse(200, appointment, "Appointment cancelled successfully"));
});

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

//api for the payement
const paymentRazorpay=asyncHandler(async(req,res)=>{
    const {appointmentId}= req.body;
    const appointmentData=await Appointment.findById(appointmentId);
    if(!appointmentData||!appointmentData.amount){
        throw new ApiError(404, "Appointment not found or cancel");
    }

    const options={
        amount: appointmentData.amount * 100, // Amount in paise
        currency: "INR",
        receipt:appointmentId
    }
    
    const order=await razorpayInstance.orders.create(options);
    if(!order){
        throw new ApiError(500, "Failed to create order");
    }
    res.status(200).json(new ApiResponse(200, order, "Order created successfully"));

})

//api to verify the payement
const verifyPayment = asyncHandler(async (req, res) => {
    const {razorpay_id} = req.body;
    if (!razorpay_id) {
        throw new ApiError(400, "Razorpay ID is required");
    }
    // Here you would typically verify the payment with Razorpay's API
    const order_info=await razorpayInstance.orders.fetch(razorpay_id);
    if (!order_info) {
        throw new ApiError(404, "Order not found");
    }
    // Check if the order is paid
    if (order_info.status !== 'paid') {
        throw new ApiError(400, "Payment not successful");
    }   
    // If payment is successful, you can update the appointment status or perform other actions
    const appointment = await Appointment.findOneAndUpdate({_id:order_info.receipt}, { payment: true }, { new: true });
    if (!appointment) {
        throw new ApiError(404, "Appointment not found");
    }
    res.status(200).json(new ApiResponse(200, appointment, "Payment verified successfully"));
    

})

export {  registerUser,loginUser,getUserProfile,updateUserProfile,bookAppointment,listAppointments,cancelAppointment,paymentRazorpay,verifyPayment};