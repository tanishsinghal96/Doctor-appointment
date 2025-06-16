import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctor.model.js"

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
    const coverLocalPath=req.files?.path;//because we use the single so no arrau getted
     //now validate the image
     if(!coverLocalPath) throw new ApiError(400,"doctors image  are required");
     //upload on thw clodinary
     const image=await uploadOnCloudinary(coverLocalPath);
     //check the succesful is not  then check the url
     if(!image||!image.url){
        throw new ApiError(500,"error occur when image are uploading");
     }
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
        fees,
        address:JSON.parse(address),
        });

     await newDoctor.save();
     //check if created or not 
     const doctor=await doctorModel.findOne({email});
     if(!doctor) throw new ApiError(500,"error occur when saving the document");
     //after validate return 
     return res.status(200).json(new ApiResponse(200,doctor,"successfully created/added doctor"))

});

export {adddoctor};