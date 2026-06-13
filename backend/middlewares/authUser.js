import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const authUser = asyncHandler(async (req, res, next) => {
    const { token } = req.headers;
    if (!token) throw new ApiError(401, "Not authorized. Please login again.");

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            throw new ApiError(401, "Session expired. Please login again.");
        }
        throw new ApiError(401, "Invalid token. Please login again.");
    }

    if (!decoded?.id) throw new ApiError(401, "Invalid token. Please login again.");

    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new ApiError(401, "User not found. Please login again.");

    req.userId = decoded.id;
    next();
});

export { authUser };
