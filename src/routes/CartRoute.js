const express = require("express");
const router = express.Router();
import CartController from "../controllers/CartController";

router.post("/create", CartController.create);
router.put("/update", CartController.update);
router.delete("/delete", CartController.delete);
router.get("/readPanigation", CartController.readPanigation);

export default router;
