const express = require("express");
const router = express.Router();
const {
  createOrderController,
  getMyOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
} = require("../controllers/orderController");

router.post("/", createOrderController);
router.get("/myorders", getMyOrdersController);
router.get("/", getAllOrdersController);
router.put("/:id", updateOrderStatusController);

module.exports = router;
