const express = require("express");
const router = express.Router();
import PublishController from "../controllers/PublishController";

router.post("/create", PublishController.create);
router.put("/update", PublishController.update);
router.delete("/delete", PublishController.delete);
router.get("/read", PublishController.read);
router.get("/readPanigation", PublishController.readPanigate);

export default router;
