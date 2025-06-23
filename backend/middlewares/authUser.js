//it is the middleware to verify the user is logged in or not
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
const authUser = asyncHandler(async (req, res, next) => {
   // console.log(req);
    const {token}=req.headers;
    if (!token) {
        throw new ApiError(401, "You are not authorized to access this resource");
    }
    //first verify the token
    const decodeToken= jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeToken) {
        throw new ApiError(401, "Invalid token");
    }
    //now find the user by token and attach the userId
    if(!decodeToken.id) {
        throw new ApiError(401, "Invalid token");
    }
    //verify the user exists in the database
    const user = await User.findById(decodeToken.id);
    if (!user) {
        throw new ApiError(401, "User not found heree");
    }
    req.userId=decodeToken.id;
    next();

})

export { authUser };
