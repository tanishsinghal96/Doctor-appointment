import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"; 
import { getAllDoctors} from "../controllers/doctor.controller.js";
const router=Router();
router
.route("/all-doctors")
.get(getAllDoctors);





export default router;

