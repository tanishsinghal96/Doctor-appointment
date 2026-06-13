//it is the middleware to verify the user is logged in or not
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import doctorModel from '../models/doctor.model.js';
import jwt from 'jsonwebtoken';
const authDoctor = asyncHandler(async (req, res, next) => {
   // console.log(req);
    const {dtoken}=req.headers;
    if (!dtoken) {
        throw new ApiError(401, "You are not authorized to access this resource");
    }
    //first verify the token
    const decodeToken= jwt.verify(dtoken, process.env.JWT_SECRET);
    if (!decodeToken) {
        throw new ApiError(401, "Invalid token");
    }
    //now find the user by token and attach the userId
    if(!decodeToken.id) {
        throw new ApiError(401, "Invalid token");
    }
    //verify the user exists in the database
    const user = await doctorModel.findById(decodeToken.id);
    if (!user) {
        throw new ApiError(401, "User not found heree");
    }
    req.docId=decodeToken.id;
    next();

})

export { authDoctor };
