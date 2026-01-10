const express = require("express");
const router = express.Router();
const authRoute = require("./auth");
router.use(express.json());

router.use("/auth", authRoute);

module.exports = router;
