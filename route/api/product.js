const express = require("express");
const createProduct = require("../../controllers/productController");
const router = express.Router();
router.use(express.json());

router.post("/createproduct", createProduct);

module.exports = router;
