import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"; 
import { adddoctor,loginadmin,getAllDoctors,toggleDoctorAvailability,getAllAppointments,cancelAppointment} from "../controllers/admin.controller.js";
import authAdmin from "../middlewares/authAdmin.js"
const router=Router();
router
    .route("/add-doctors")
    .post(authAdmin,upload.single("docImg"),adddoctor);

router
    .route("/login")
    .post(loginadmin);

router
.route("/all-doctors")
.get(authAdmin,getAllDoctors);

router
.route("/toggle-doctor-availability/:doctorId")
.patch(authAdmin,toggleDoctorAvailability);

router.route("/list-appointments").get(authAdmin,getAllAppointments);

router.route("/cancel-appointment").patch(authAdmin,cancelAppointment);




export default router;

