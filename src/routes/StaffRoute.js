const express = require("express");
const router = express.Router();
import StaffController from "../controllers/StaffController";

router.post("/create", StaffController.create);
router.put("/update", StaffController.update);
router.get("/read", StaffController.read);
router.delete("/delete", StaffController.delete);
router.get("/readPanigation", StaffController.readPanigation);

export default router;
