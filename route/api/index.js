const express = require("express");
const router = express.Router();
const authRoute = require("./auth");
const categoryRoute = require("./category");
router.use(express.json());

router.use("/auth", authRoute);
router.use("/category", categoryRoute);
module.exports = router;
