const emailVerification = require("../helpers/emailVerification");
const userSchema = require("../model/userSchema");
const crypto = require("crypto");

// ====================== firstOtpController Part Start Here =================
const firstOtpController = async function (req, res) {
  const { email, otp } = req.body;
  const user = await userSchema.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "User Not Found",
    });
  }
  if (user.isVerified) {
    return res.json({
      message: "User Is Verified",
    });
  }
  if (user.otp !== otp || user.expireOtp < Date.now()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  user.isVerified = true;
  user.otp = undefined;
  user.expireOtp = undefined;
  await user.save();
  res.status(200).json({
    message: "Email Verification Done",
  });
};
// ==================== firstOtpController Part End Here =================

//================= ResendOtpController Part Start Here =================
const resendOtpController = async (req, res) => {
  const { email } = req.body;
  const resendOtp = await userSchema.findOne({ email });
  if (!resendOtp) {
    return res.status(400).json({ message: "User Not Found" });
  }
  // const otp = Math.floor(100000 + Math.random() * 900000);
  const otp = crypto.randomInt(100000, 999999).toString();
  const expireOtp = Date.now() + 5 * 60 * 1000; // 5 minutes
  resendOtp.otp = otp;
  resendOtp.expireOtp = expireOtp;
  await resendOtp.save();
  await emailVerification(email, otp, true);
  res.status(200).json({
    message: "OTP Resend Successfully",
  });
};
//=================ResendOtpController Part End Here =================


module.exports = { firstOtpController, resendOtpController };