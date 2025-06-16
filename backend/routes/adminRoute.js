import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"; 
import { adddoctor,loginadmin} from "../controllers/admin.controller.js";
import authAdmin from "../middlewares/authAdmin.js"
const router=Router();
router
    .route("/add-doctors")
    .post(authAdmin,upload.single("image"),adddoctor);

router
    .route("/login")
    .post(loginadmin);







export default router;

