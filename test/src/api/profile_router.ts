import { Router } from "express";
import ProfileController from "../controllers/profile_controller.js";
import multiUpload from "../middlewares/multer.js";

const profileController = new ProfileController();
const router = Router();

router.get("/getProfile", profileController.getProfile);
router.post("/updateProfile", multiUpload, profileController.updateProfile);

router.post("/createLink", multiUpload, profileController.createLink);
router.post("/deleteLink", profileController.deleteLink);

export default router;
