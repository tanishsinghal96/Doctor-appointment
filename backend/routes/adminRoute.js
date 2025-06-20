import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"; 
import { adddoctor,loginadmin,getAllDoctors,toggleDoctorAvailability} from "../controllers/admin.controller.js";
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





export default router;

