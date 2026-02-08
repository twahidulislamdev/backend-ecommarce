const express = require("express");
const {
  createCategory,
  getAllCategory,
  updateCategory,
} = require("../../controllers/categoryController");
const router = express.Router();

router.use(express.json());

router.post("/createcategory", createCategory);
router.get("/getallcategory", getAllCategory);
router.patch("/updatecategory/:id", updateCategory);

module.exports = router;
