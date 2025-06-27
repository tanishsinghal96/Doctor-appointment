import {asyncHandler} from "../utils/asyncHandler.js"
import doctorModel from "../models/doctor.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Doctor from '../models/doctor.model.js';
import Appointment from '../models/appointment.model.js';
import User from '../models/user.model.js';
const getAllDoctors=asyncHandler(async(req,res)=>{
    //applied the autAdmin to it for verify the Admin
    //get all the doctros from the dtabase and remove the sensitive details like password
    const doctors=await doctorModel.find({}).select("-password -__v -email");
    if(!doctors||doctors.length===0) throw new ApiError(404,"no doctors found");
    return res.status(200).json(new ApiResponse(200,doctors,"successfully fetched all doctors"));
})




export { getAllDoctors };