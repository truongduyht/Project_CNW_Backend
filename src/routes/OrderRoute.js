const express = require("express");
const router = express.Router();
import OrderController from "../controllers/OrderController";

router.post("/create", OrderController.create);
router.get("/readPanigation", OrderController.readPanigation);
router.get("/read", OrderController.read);
router.put("/update", OrderController.update);
router.delete("/delete", OrderController.delete);
router.get("/revenue", OrderController.revenue);
router.get("/dashboard", OrderController.dashboard);

export default router;
