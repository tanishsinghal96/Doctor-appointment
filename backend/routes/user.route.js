import {Router} from 'express';
import { registerUser,loginUser,getUserProfile,updateUserProfile,bookAppointment } from '../controllers/user.controller.js';
import { authUser } from '../middlewares/authUser.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/get-profile').get(authUser, getUserProfile);
router.route('/update-profile').patch(authUser, upload.single('image'), updateUserProfile);
router.route('/book-appointment').post(authUser,bookAppointment);
export default router