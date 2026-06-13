import {Router} from 'express';
import { registerUser,loginUser,getUserProfile,updateUserProfile,bookAppointment,listAppointments,cancelAppointment,paymentRazorpay,verifyPayment,addReview } from '../controllers/user.controller.js';
import { authUser } from '../middlewares/authUser.js';
import { upload } from '../middlewares/multer.middleware.js';
import loginLimiter from '../middlewares/loginLimiter.js'; // Assuming you have a login limiter middleware
import genLimiter from '../middlewares/genLimiter.js'; // Assuming you have a general rate limiter middleware
const router = Router();
router.route('/register').post(registerUser)
router.route('/login').post(loginLimiter,loginUser)
router.route('/get-profile').get(genLimiter, authUser, getUserProfile);
router.route('/update-profile').patch(genLimiter, authUser, upload.single('image'), updateUserProfile);
router.route('/book-appointment').post(genLimiter, authUser, bookAppointment);
router.route('/list-appointments').get(genLimiter, authUser, listAppointments);
router.route('/cancel-appointment').patch(genLimiter, authUser, cancelAppointment);
router.route('/payment-razorpay').post(genLimiter, authUser, paymentRazorpay);
router.route('/verify-payment').post(genLimiter, authUser, verifyPayment);
router.route('/add-review').post(genLimiter, authUser, addReview);
export default router