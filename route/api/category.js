const express = require("express");
const {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} = require("../../controllers/categoryController");
const router = express.Router();

router.use(express.json());

router.post("/createcategory", createCategory);
router.get("/getallcategory", getAllCategory);
router.patch("/updatecategory/:id", updateCategory);
router.delete("/deletecategory/:id", deleteCategory);


module.exports = router;
