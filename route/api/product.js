const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  createProduct,
  getAllProducts,
  deleteSingleProduct,
  updateProduct,
  deleteAllProducts,
} = require("../../controllers/productController");
const router = express.Router();
router.use(express.json());

router.post("/createproduct", upload.single("avatar"), createProduct);
router.post("/getallproducts", getAllProducts);
router.put("/updateproduct/:id", updateProduct);
router.delete("/deletesingleproduct/:id", deleteSingleProduct);
router.delete("/deleteallproducts", deleteAllProducts);

module.exports = router;
