const express = require("express");
const router = express.Router();
const authRoute = require("./customerAuth");
const adminRoute = require("./adminAuth");
const categoryRoute = require("./category");
const subCategoryRoute = require("./subCategory");
const productRoute = require("./product");
router.use(express.json());

router.use("/customer", authRoute);
router.use("/admin", adminRoute);
router.use("/category", categoryRoute);
router.use("/subcategory", subCategoryRoute);
router.use("/product", productRoute);

module.exports = router;
