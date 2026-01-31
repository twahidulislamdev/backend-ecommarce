const express = require("express");
const { createCategory, getAllCategory } = require("../../controllers/categoryController");
const router = express.Router();

router.use(express.json());

router.post("/createcategory", createCategory);
router.get("/getallcategory", getAllCategory);

module.exports = router;
