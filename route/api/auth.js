const express = require("express");
const signupController = require("../../controllers/signupController");
const {
  otpController,
  resendOtpController,
} = require("../../controllers/otpController");
const router = express.Router();

router.post("/signup", signupController);
router.post("/otpverify", otpController);
router.post("/resendotp", resendOtpController);

// router.get("/login", (req, res) => {
//   res.send("Data Ache");
// });

module.exports = router;
