import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
const authAdmin=asyncHandler(async (req,res,next)=>{
    const {atoken}=req.headers;//if we want to use the cookie then use the cooki-parser
    //now check the token is present or not get from the header or body or cookies
    if(!atoken) throw new ApiError(400,"not authorized admin")
    const decodetoken= jwt.verify(atoken,process.env.JWT_SECRET);
    if(decodetoken!==process.env.ADMIN_EMAIL+process.env.ADMIN_PASS){
        throw new ApiError(400,"not authorized admin");
    }
    //if present then go to the next()

    next()
})
export default authAdmin;