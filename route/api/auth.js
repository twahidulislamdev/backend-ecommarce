const express = require("express");
const {
  signupController,
  loginController,
  logoutController,
  dashboardController,
} = require("../../controllers/authController");
const {
  firstOtpController,
  resendOtpController,
} = require("../../controllers/otpController");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/otpverify", firstOtpController);
router.post("/resendotp", resendOtpController);
router.get("/dashboard", authMiddleware, dashboardController);

// router.get("/login", (req, res) => {
//   res.send("Data Ache");
// });

module.exports = router;
