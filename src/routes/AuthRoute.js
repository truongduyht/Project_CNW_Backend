const express = require("express");
const router = express.Router();
import AuthController from "../controllers/AuthController";

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);
router.get("/profile", AuthController.getProfile);

export default router;
