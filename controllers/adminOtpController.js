const emailVerification = require("../helpers/emailVerification");
const adminSchema = require("../model/adminSchema");
const crypto = require("crypto");

// ====================== FirstOtpController Part Start Here =================
const FirstOtpController = async (req, res) => {
  const { email, otp } = req.body;
  const user = await adminSchema.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Admin Not Found",
    });
  }
  if (user.isVerified) {
    return res.json({
      message: "Admin Is Verified",
    });
  }
  if (user.otp !== otp || user.expireOtp < Date.now()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  user.isVerified = true;
  user.otp = undefined;
  user.expireOtp = undefined;
  await user.save();
  res.status(200).json({ message: "Email Verification Done" });
};
// ==================== firstOtpController Part End Here =================

//================= resend OTP Part Start Here =================
const ResendOtpController = async (req, res) => {
  const { email } = req.body;
  const user = await adminSchema.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Error: Admin Not Found" });
  }
  if (user.isVerified) {
    return res.status(400).json({ message: "Error: Email already verified" });
  }
  if (user.expireOtp && user.expireOtp > Date.now()) {
    return res.status(400).json({ message: "Error: OTP is still valid" });
  }
  const otp = crypto.randomInt(100000, 999999).toString();
  const expireOtp = Date.now() + 5 * 60 * 1000;
  user.otp = otp;
  user.expireOtp = expireOtp;
  await user.save();
  await emailVerification(email, otp, true);
  res.status(200).json({ message: "OTP Resend Successfully" });
};
//================= resend OTP Part End Here =================

module.exports = { FirstOtpController, ResendOtpController };
