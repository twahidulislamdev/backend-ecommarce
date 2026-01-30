const emailValidation = require("../helpers/emailValidation");
const userSchema = require("../model/userSchema");
const bcrypt = require("bcrypt");

/* ======================= LOGIN CONTROLLER Start ======================= */
const loginController = async (req, res) => {
  try {
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
    const exestinguser = await userSchema.findOne({ email });
    if (!exestinguser) {
      return res.json({ message: "Error: User Not Found" });
    }

    // Check verification
    if (!exestinguser.isVerified) {
      return res.json({ message: "Error: User Not Verified" });
    }

    // Compare password
    const matchPassword = await bcrypt.compare(password, exestinguser.password);
    if (!matchPassword) {
      return res.json({ message: "Error: Incorrect Password" });
    }
    // Create session
    req.session.isAuth = true;
    req.session.userSchema = {
      id: exestinguser._id,
      email: exestinguser.email,
      firstName: exestinguser.firstName,
    };
    return res.json({
      message: "Logged in Successfully",
      // user: req.session.userSchema,
    });
  } catch (error) {
    return res.json({ message: "Error: Login Failed" });
  }
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
