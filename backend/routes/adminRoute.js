import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"; 
import { adddoctor} from "../controllers/admin.controller.js";

const router=Router();
router
    .route("/add-doctors")
    .post(upload.single("cover"),adddoctor);



export default router;

