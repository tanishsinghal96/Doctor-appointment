import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctor.model.js"
import validator from "validator"
import Doctor from '../models/doctor.model.js';
import Appointment from '../models/appointment.model.js';
//api for the adding the doctors
const adddoctor=asyncHandler(async (req,res)=>{
    const {name,email,password,speciality,degree,experience,about,fees,address}=req.body;
    //validate the above fields
    if([name,email,password,speciality,degree,experience,about,fees,address].some((field)=>(!field||field.trim()===""))){
        throw new ApiError(400,"all fields are required");
    }
    
    //valid email and strong password check
    if(!validator.isEmail(email)){
        throw new ApiError(400,"valid emails are required");
    } 
    if(password.length<8){
        throw new ApiError(400,"password is not strong");
    }
    //hashing the password here 
    const coverLocalPath=req.file?.path;//because we use the single so no arrau getted
     //now validate the image
     if(!coverLocalPath) throw new ApiError(400,"doctors image  are required");
     //upload on thw clodinary
     const image=await uploadOnCloudinary(coverLocalPath);
     //check the succesful is not  then check the url
     if(!image||!image.url){
        throw new ApiError(500,"error occur when image are uploading");
     }
    //  console.log(image);
     //now create the document in the model
     const newDoctor=new doctorModel({
        name,
        email,
        image:image.url,
        password,
        speciality,
        degree,
        experience,
        about,
        fees:Number(fees),
        address:JSON.parse(address),
        });
     
     await newDoctor.save();
     //check if created or not 
     const doctor=await doctorModel.findOne({email});
     console.log(doctor);
     if(!doctor) throw new ApiError(500,"error occur when saving the document");
     //after validate return 
     return res.status(200).json(new ApiResponse(200,doctor,"successfully created/added doctor"))

});


const loginadmin=asyncHandler(async(req,res)=>{
    //login the admin write step to follow
    //get the email and password
    //validate both and verified
    //if yes then generate the token and send in the response
    const {email,password}=req.body;
    console.log(email,password);
    if(!email||!password) throw new ApiError(400,"email and password both are required")
    console.log("after verify1ng the email and password");
    if(email.trim()!==process.env.ADMIN_EMAIL||password.trim()!==process.env.ADMIN_PASS){
        throw new ApiError(400,"wrong credentials")
    }
    console.log("after verify1ng the email and password  2");
     
    const token =jwt.sign(email+password,process.env.JWT_SECRET);
    if(!token)  throw new ApiError(500,"error when generatign the token")
    console.log(token);
    return res.status(200).json(new ApiResponse(200,{atoken:token},"successfully logged in the admin"));

})

//to send the all doctors
const getAllDoctors=asyncHandler(async(req,res)=>{
    //applied the autAdmin to it for verify the Admin
    //get all the doctros from the dtabase and remove the sensitive details like password
    const doctors=await doctorModel.find({}).select("-password -__v");
    if(!doctors||doctors.length===0) throw new ApiError(404,"no doctors found");
    return res.status(200).json(new ApiResponse(200,doctors,"successfully fetched all doctors"));
}) 

const toggleDoctorAvailability = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  const { available } = req.body;
  
 
  console.log("Toggle Doctor Availability Request:", { doctorId, available });
  //all print the type of these
    console.log("Type of doctorId:", typeof doctorId);
    console.log("Type of available:", typeof available);
  if (typeof available === 'string') {
  available = available.toLowerCase() === 'true';
}
  // Find the doctor by ID and update their availability
  const doctor = await doctorModel.findByIdAndUpdate(
    doctorId,
    { available },
    { new: true }
  );

  // If doctor not found, return error
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  // Return the updated doctor information
 
    return res.status(200).json(
        new ApiResponse(200, doctor, "Doctor availability updated successfully"));
        
});

const getAllAppointments=asyncHandler(async(req,res)=>{
   const appointment=await  Appointment.find({}).populate("userId","name image gender dob").populate("docId","name image fees");
   if(!appointment){
      throw new ApiError(500,"failed while fetching");
   }

   res.status(200).json(new ApiResponse(200,appointment,"successfully fetched the appointment"));

})

 const cancelAppointment = asyncHandler(async (req, res) => {
   console.log("Cancel Appointment Request Received");
    const { appointmentId } = req.body; 
    console.log("Cancel Appointment Request:", appointmentId); 
    if (!appointmentId) {
        throw new ApiError(400, "Please provide appointment ID");
    }
    //now find the appointment by the id and user id then update the appointment as the canceeld tue and in the docotr model als 
    //in the doctor model we will remove the slot from the slotsBooked
    
    const appointment = await Appointment.findOne(
        { _id: appointmentId },
    );
    if (!appointment) {
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

export {adddoctor,loginadmin,getAllDoctors,toggleDoctorAvailability,getAllAppointments,cancelAppointment};