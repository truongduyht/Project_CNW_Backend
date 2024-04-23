const express = require("express");
const router = express.Router();
import ReaderController from "../controllers/ReaderController";

router.post("/update", ReaderController.update);
router.get("/readPanigation", ReaderController.readPanigation);

export default router;
