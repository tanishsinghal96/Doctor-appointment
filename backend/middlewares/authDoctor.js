import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import doctorModel from '../models/doctor.model.js';
import jwt from 'jsonwebtoken';

const authDoctor = asyncHandler(async (req, res, next) => {
    const { dtoken } = req.headers;
    if (!dtoken) throw new ApiError(401, "Not authorized. Please login again.");

    let decoded;
    try {
        decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            throw new ApiError(401, "Session expired. Please login again.");
        }
        throw new ApiError(401, "Invalid token. Please login again.");
    }

    if (!decoded?.id) throw new ApiError(401, "Invalid token. Please login again.");

    const doctor = await doctorModel.findById(decoded.id).select("-password");
    if (!doctor) throw new ApiError(401, "Doctor not found. Please login again.");

    req.docId = decoded.id;
    next();
});

export { authDoctor };
