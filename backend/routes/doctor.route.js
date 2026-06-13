import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"; 
import { getAllDoctors,logindoctor,getDoctorAppointments,cancelAppointment,appointmentComplete,doctorDashboard,doctorProfile,updateProfile} from "../controllers/doctor.controller.js";
import  {authDoctor} from "../middlewares/authDoctor.js";
const router=Router();
router
.route("/all-doctors")
.get(getAllDoctors);

router
.route("/login")
.post(logindoctor);

router.route("/appointments").get(authDoctor,getDoctorAppointments);

router.route("/cancel-appointment").patch(authDoctor, cancelAppointment);

router.route("/complete-appointment").patch(authDoctor, appointmentComplete);

router.route("/dashboard-data").get(authDoctor,doctorDashboard);
router.route("/profile").get(authDoctor,doctorProfile);

router.route("/update-profile").patch(authDoctor, updateProfile);

export default router;

