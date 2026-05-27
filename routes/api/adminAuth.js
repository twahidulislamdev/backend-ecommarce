const express = require("express");
const router = express.Router();
const {
  signupController,
  loginController,
  logoutController,
  GetAllAdminController,
  DashboardController,
  CurrentUserController,
} = require("../../controllers/adminAuthController");

const { FirstOtpController, ResendOtpController } = require("../../controllers/adminOtpController");

const authMiddleware = require("../../middleware/authMiddleware");
const adminSchema = require("../../model/adminSchema");

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/otpverify", FirstOtpController);
router.post("/resendotp", ResendOtpController);
router.get("/getalladmins", GetAllAdminController);

router.get("/dashboard", authMiddleware, DashboardController);
router.get("/currentuser", CurrentUserController);

router.get("/getme", async (req, res) => {
  if (!req.session.userSchema || !req.session.userSchema.email) {
    return res.status(401).json({ message: "Unauthorized Person" });
  }
  const findUser = await adminSchema.findOne({ email: req.session.userSchema.email });
  res.send(findUser);
});

module.exports = router;
