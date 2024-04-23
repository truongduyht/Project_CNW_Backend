const express = require("express");
const router = express.Router();
import BookController from "../controllers/BookController";
import uploadCloud from "../middlewares/uploadImage";

router.get("/read", BookController.read);
router.get("/readPanigate", BookController.readPanigate);
router.post("/create", uploadCloud.single("AnhSach"), BookController.create);
router.put("/update", uploadCloud.single("AnhSach"), BookController.update);
router.delete("/delete", BookController.delete);

export default router;
