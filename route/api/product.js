const express = require("express");
const {
  createProduct,
  getAllProducts,
  deleteSingleProduct,
  updateProduct,
  deleteAllProducts,
} = require("../../controllers/productController");
const router = express.Router();
router.use(express.json());

router.post("/createproduct", createProduct);
router.post("/getAllProducts", getAllProducts);
router.put("/updateProduct/:id", updateProduct);
router.delete("/deleteSingleProduct/:id", deleteSingleProduct);
router.delete("/deleteAllProducts", deleteAllProducts);

module.exports = router;
