const express = require("express");
const signupController = require("../../controllers/signupController");
const router = express.Router();

router.post("/signup", signupController);

// router.get("/login", (req, res) => {
//   res.send("Data Ache");
// });

module.exports = router;
