import  rateLimit from 'express-rate-limit';
import {ApiError} from '../utils/apiError.js';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next, options) => {
    // Trigger your own error response
    // You can use your error handler or respond directly here
    const error = new ApiError(
      429,
      'Too many login attempts from this IP, please try again after 15 minutes'
    );
    // If you use centralized error handler:
    next(error);

    // Or if you want to send response directly:
    // res.status(429).json(new ApiResponse(429, null, error.message));
  }
});

export default loginLimiter; 
