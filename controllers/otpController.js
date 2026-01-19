const userSchema = require("../model/userSchema");

const otpController = async function (req, res) {
  const { email, otp } = req.body;
  const user = await userSchema.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "User Not Found",
    });
  }
  if (user.isVerified) {
    return res.json({
      messege: "User Is Verified",
    });
  }

  if (user.otp !== otp || user.expireOtp < Date.now()) {
    return res.status(400).json({ messes: "invalied otp" });
  }
  user.isVerified = true;
  user.otp = undefined;
  user.expireOtp = undefined;
  await user.save();
  res.status(200).json({
    message: "Email Verification Done",
  });
};

module.exports = otpController;
