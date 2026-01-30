const express = require("express");
const signupController = require("../../controllers/signupController");
const {
  otpController,
  resendOtpController,
} = require("../../controllers/otpController");
const {
  loginController,
  logoutController,
  dashboardController,
} = require("../../controllers/loginController");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/signup", signupController);
router.post("/otpverify", otpController);
router.post("/resendotp", resendOtpController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/dashboard", authMiddleware, dashboardController);

// router.get("/login", (req, res) => {
//   res.send("Data Ache");
// });

module.exports = router;
