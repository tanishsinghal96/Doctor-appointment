import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
const authAdmin=asyncHandler(async (req,res,next)=>{
    const {atoken}=req.headers;
    if(!atoken) throw new ApiError(401,"not authorized admin")
    const decodetoken= jwt.verify(atoken,process.env.JWT_SECRET);
    if(!decodetoken?.email || decodetoken.email!==process.env.ADMIN_EMAIL){
        throw new ApiError(401,"not authorized admin");
    }
    next()
})
export default authAdmin;