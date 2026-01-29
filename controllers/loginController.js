const emailValidation = require("../helpers/emailValidation");
const userSchema = require("../model/userSchema");
const bcrypt = require("bcrypt");

const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.json({
      message: "Error: Email Required",
    });
  }
  if (!password) {
    return res.json({
      message: "Error: Password Required",
    });
  }
  if (!emailValidation(email)) {
    return res.json({
      message: "Error: Invalid Email Format",
    });
  }
  // Use this to check duplicate user by Email
  const duplicateUser = await userSchema.findOne({ email });
  if (!duplicateUser) {
    return res.json({
      message: "Error: User Not Found",
    });
  }
  // if user is not verified then return this message
  if (!duplicateUser.isVerified) {
    return res.json({
      message: "Error: User Not Verified",
    });
  }
  // Use bcrypt to compare password Start
  const matchPassword = await bcrypt.compare(password, duplicateUser.password);
  if (!matchPassword) {
    return res.json({
      message: "Error: Incorrect Password",
    });
  }
  return res.json({
    message: "Logged in Successfully",
  });
  // Use bcrypt to compare password End

  // console.log(req.session);
  req.session.userSchema({
    id: duplicateUser.id,
    email: duplicateUser.email,
    firstName: duplicateUser.firstName,
    lastName: duplicateUser.lastName,
  });
};

const logoutController = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ message: "Error: Unable to logout" });
    }
    res.clearCookie("connect.sid");
    return res.json({ message: "Logged out successfully" });
  });
};

const dashboardController = (req, res) => {
  if (req.session.userSchema) {
    return res.json({
      message: "Welcome to Dashboard",
      user: req.session.userSchema,
    });
  }
  return res.json({ message: "Access Denied" });
};
module.exports = { loginController, logoutController, dashboardController };
