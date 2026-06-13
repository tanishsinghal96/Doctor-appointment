import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const authAdmin = asyncHandler(async (req, res, next) => {
    const { atoken } = req.headers;
    if (!atoken) throw new ApiError(401, "Not authorized. Please login again.");

    let decoded;
    try {
        decoded = jwt.verify(atoken, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            throw new ApiError(401, "Session expired. Please login again.");
        }
        throw new ApiError(401, "Invalid token. Please login again.");
    }

    if (!decoded?.email || decoded.email !== process.env.ADMIN_EMAIL) {
        throw new ApiError(401, "Not authorized admin.");
    }

    next();
});

export default authAdmin;
