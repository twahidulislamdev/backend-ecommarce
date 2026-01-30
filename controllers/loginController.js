const emailValidation = require("../helpers/emailValidation");
const userSchema = require("../model/userSchema");
const bcrypt = require("bcrypt");

/* ======================= LOGIN CONTROLLER Start ======================= */
const loginController = async (req, res) => {
  const { email, password } = req.body;
  // Check email
  if (!email) {
    return res.json({ message: "Error: Email Required" });
  }
  // Check password
  if (!password) {
    return res.json({ message: "Error: Password Required" });
  }
  // Validate email format
  if (!emailValidation(email)) {
    return res.json({ message: "Error: Invalid Email Format" });
  }
  // Find user
  const existingUser = await userSchema.findOne({ email });
  if (!existingUser) {
    return res.json({ message: "Error: User Not Found" });
  }
  // Check verification
  if (!existingUser.isVerified) {
    return res.json({ message: "Error: User Not Verified" });
  }
  // Compare password
  const matchPassword = await bcrypt.compare(password, existingUser.password);
  if (!matchPassword) {
    return res.json({ message: "Error: Incorrect Password" });
  }

  // Create session
  req.session.isAuth = true;
  req.session.userSchema = {
    id: existingUser.id,
    email: existingUser.email,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
  };
  return res.json({
    message: "Login in Successfully",
    // user: req.session.userSchema,
  });
};
/* ======================= LOGIN CONTROLLER End ======================= */

/* ======================= LOGOUT CONTROLLER Start ======================= */
const logoutController = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ message: "Error: Unable to logout" });
    }

    res.clearCookie("connect.sid");
    return res.json({ message: "Logged out successfully" });
  });
};
/* ======================= LOGOUT CONTROLLER End ======================= */

/* ======================= DASHBOARD CONTROLLER Start ======================= */
const dashboardController = (req, res) => {
  if (req.session.isAuth && req.session.userSchema) {
    return res.json({
      message: "Welcome to Dashboard",
      // user: req.session.userSchema,
    });
  }
  return res.json({ message: "Access Denied" });
};
/* ======================= DASHBOARD CONTROLLER End ======================= */

module.exports = {
  loginController,
  logoutController,
  dashboardController,
};
