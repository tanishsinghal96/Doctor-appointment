import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctor.model.js"
import validator from "validator"
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

    if(!email||!password) throw new ApiError(400,"email and password both are required")
    if(email.trim()!==process.env.ADMIN_EMAIL||password.trim()!==process.env.ADMIN_PASS){
        throw new ApiError(404,"wrong credentials")
    }

    const token =jwt.sign(email+password,process.env.JWT_SECRET);
    if(!token)  throw new ApiError(500,"error when generatign the token")

    return res.status(200).json(new ApiResponse(200,{token},"successfully logged in the admin"));

})

export {adddoctor,loginadmin};