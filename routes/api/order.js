const express = require("express");
const router = express.Router();
const { createOrderController } = require("../controllers/orderController");

router.post("/", createOrderController);
