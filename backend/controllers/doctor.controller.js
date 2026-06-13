import {asyncHandler} from "../utils/asyncHandler.js"
import doctorModel from "../models/doctor.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import Appointment from '../models/appointment.model.js';
import User from '../models/user.model.js';
import Doctor from '../models/doctor.model.js';
import Review from '../models/review.model.js';
import mongoose from 'mongoose';
const getAllDoctors=asyncHandler(async(req,res)=>{ 
    //applied the autAdmin to it for verify the Admin
    //get all the doctros from the dtabase and remove the sensitive details like password
    const doctors=await doctorModel.find({}).populate({path:'reviews',populate:[{path:'patient',select:'name image'},{path:'doctor',select:'name image'}]}).select("-password -__v -email");
    if(!doctors||doctors.length===0) throw new ApiError(404,"no doctors found");
    return res.status(200).json(new ApiResponse(200,doctors,"successfully fetched all doctors"));
})

const logindoctor=asyncHandler(async(req,res)=>{
    //login the admin write step to follow
    //get the email and password
    //validate both and verified
    //if yes then generate the token and send in the response
    const {email,password}=req.body;
    //console.log(email,password);
    if(!email||!password) throw new ApiError(400,"email and password both are required")
    //now check that docotro from current emial is present or not
    const doctor=await doctorModel.findOne({email});
    if(!doctor) throw new ApiError(404,"doctor not found with this email");
    //now check the password is correct or not
   // console.log(password,doctor.password);
    const isPasswordCorrect=await doctor.ispasswordCorrect(password);
  //  console.log(isPasswordCorrect);
    if(!isPasswordCorrect) throw new ApiError(400,"wrong credentials");
    
    
 
    const token = jwt.sign({id: doctor._id}, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log("token is ",token);
    return res.status(200).json(new ApiResponse(200,{dToken:token},"successfully logged in the doctor"));
  
})

//get the appointments for the doctor given in the token
const getDoctorAppointments = asyncHandler(async (req, res) => {
    
    //first verify the token
    
    //verify the user exists in the database
    const doctor = await doctorModel.findById(req.docId);
    if (!doctor) {
        throw new ApiError(401, "Doctor not found");
    }
    
    //get all appointments for this doctor
    const appointments = await Appointment.find({ docId: doctor._id }).populate('userId', 'name email dob image').populate('docId', 'name email');
    
    return res.status(200).json(new ApiResponse(200, appointments, "Successfully fetched appointments"));
});

const cancelAppointment = asyncHandler(async (req, res) => {
    const { appointmentId } = req.body;
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
     if(appointment.docId.toString()!==req.docId) throw new ApiError(403,"You are not allowed to cancel this appointment");

    const doctor = await Doctor.findById(appointment.docId);
    if (!doctor) {
        throw new ApiError(404, "Doctor not found for this appointment");
    }
   // console.log(appointment);
    //now update the appointment as cancelled
    appointment.cancelled = true;
    appointment.isCompleted = false; // Assuming you want to mark it as not completed
    await appointment.save();
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

const appointmentComplete=asyncHandler(async(req,res)=>{
      const {docId}=req;
      const {appointmentId}=req.body;
      if(!appointmentId) throw new ApiError(400,"Please provide appointment ID");
      //check that doctor is same as the appointment doctor
      const appointment=await Appointment.findOne({_id:appointmentId});
      if(!appointment) throw new ApiError(404,"Appointment not found");
      if(appointment.docId.toString()!==docId) throw new ApiError(403,"You are not allowed to complete this appointment");
      //now update the appointment as completed
      appointment.isCompleted = true;
      await appointment.save();
      return res.status(200).json(new ApiResponse(200, appointment, "Appointment completed successfully"));
      

})

const doctorDashboard =asyncHandler(async(req,res)=>{
      //get the number of appointments,amount,unique patients,latest appointments
      //get the doc id from the req
      //now get the all the appointment for the docId 
      const {docId}=req;
      const appointments= await Appointment.find({docId:docId}).populate('userId', 'name image dob').populate('docId', 'name image');
      
      const unique = await Appointment.aggregate([
        { $match: { docId: new mongoose.Types.ObjectId(docId) } },
        { $group: { _id: "$userId" } },
        { $count: "total" }
      ]);

      const earning = await Appointment.aggregate([
        { $match: { payment: true, docId: new mongoose.Types.ObjectId(docId) } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      res.status(200).json(new ApiResponse(200, {
              totalAppointments: appointments.length,
              totalUsers: unique[0]?.total || 0,
              totalEarnings: earning[0]?.total || 0,
              appointments: appointments.slice(-5).reverse()
          }, "Dashboard data fetched successfully"));



})

const doctorProfile=asyncHandler(async(req,res)=>{
    //get the docId from the req
    const {docId}=req;
    //now get the doctor from the database
    const doctor=await doctorModel.findById(docId).select("-password -__v");
    if(!doctor) throw new ApiError(404,"Doctor not found");
    return res.status(200).json(new ApiResponse(200,doctor,"Doctor profile fetched successfully"));
})

const updateProfile=asyncHandler(async(req,res)=>{
    //get the docId from the req
    const {docId}=req;
    //now get the doctor from the database
    const doctor=await doctorModel.findById(docId);
    if(!doctor) throw new ApiError(404,"Doctor not found");
    //now update the doctor with the req body
    const updatedDoctor=await doctorModel.findByIdAndUpdate(docId,req.body,{new:true,runValidators: true});
    if(!updatedDoctor) throw new ApiError(500,"Error updating doctor profile");
    return res.status(200).json(new ApiResponse(200,updatedDoctor,"Doctor profile updated successfully"));
})





export { getAllDoctors,logindoctor,getDoctorAppointments,cancelAppointment,appointmentComplete,doctorDashboard,doctorProfile,updateProfile};