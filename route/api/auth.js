const express = require("express");
const signupController = require("../../controllers/signupController");
const router = express.Router();

// router.get("/login", (req, res) => {
//   res.send("Data Ache");
// });
router.post("/signup", signupController);

module.exports = router;
