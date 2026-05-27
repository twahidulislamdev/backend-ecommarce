const express = require("express");
const adminSchema = require("../model/adminSchema");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const emailValidation = require("../helpers/emailValidation");
const emailVerification = require("../helpers/emailVerification");

/* ======================= SIGNUP CONTROLLER Start ======================= */
const signupController = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName) {
    return res.json({
      message: "Error: First Name Required",
    });
  }
  if (!lastName) {
    return res.json({
      message: "Error: Last Name Required",
    });
  }
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
      message: "Error: Email format is not Correct",
    });
  }

  const duplicateEmail = await adminSchema.findOne({ email });
  if (duplicateEmail) {
    return res.json({
      message: "Error: Email Already Exists",
    });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresOtp = new Date(Date.now() + 5 * 60 * 1000);

  bcrypt.hash(password, 10, function (err, hash) {
    const users = new adminSchema({
      firstName,
      lastName,
      email,
      password: hash,
      otp,
      expireOtp: expiresOtp,
      role: "admin",
      status: "active",
    });
    emailVerification(email, otp);
    users.save();
    res.json({
      messege: "Admin Account Created Successfully. Please Verify Using OTP",
    });
  });
};
/* ======================= SIGNUP CONTROLLER End ======================= */

/* ======================= LOGIN CONTROLLER Start ======================= */
const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.json({ message: "Error: Email Required" });
  }
  if (!password) {
    return res.json({ message: "Error: Password Required" });
  }
  if (!emailValidation(email)) {
    return res.json({ message: "Error: Invalid Email Format" });
  }
  const existingUser = await adminSchema.findOne({ email });
  if (!existingUser) {
    return res.json({ message: "Error: Admin Not Found" });
  }
  if (!existingUser.isVerified) {
    return res.json({ message: "Error: Admin Not Verified" });
  }
  const matchPassword = await bcrypt.compare(password, existingUser.password);
  if (!matchPassword) {
    return res.json({ message: "Error: Incorrect Password" });
  }

  req.session.isAuth = true;
  req.session.userSchema = {
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    id: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
  };
  return res.json({ message: "Admin Login Successfully" });
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

// Get all admins
const GetAllAdminController = async (req, res) => {
  try {
    const users = await adminSchema.find();
    return res.json({ message: "Admins retrieved successfully", users });
  } catch (error) {
    return res.json({ message: "Error retrieving admins", error: error.message });
  }
};

/* ======================= DASHBOARD CONTROLLER Start ======================= */
const DashboardController = (req, res) => {
  if (req.session.isAuth && req.session.userSchema) {
    return res.json({
      message: "Welcome to Admin Dashboard",
      // user: req.session.userSchema,
    });
  }
  return res.json({ message: "Access Denied" });
};
/* ======================= DASHBOARD CONTROLLER End ======================= */

/* ======================= CURRENT USER CONTROLLER Start ======================= */
const CurrentUserController = (req, res) => {
  if (req.session.isAuth && req.session.userSchema) {
    return res.json({
      message: "Current Admin Retrieved Successfully",
      user: req.session.userSchema,
    });
  }
  return res.json({ message: "Access Denied" });
};
/* ======================= CURRENT USER CONTROLLER End ======================= */

module.exports = {
  signupController,
  loginController,
  logoutController,
  GetAllAdminController,
  DashboardController,
  CurrentUserController,
};
