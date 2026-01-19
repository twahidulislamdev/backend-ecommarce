const express = require("express");
const userSchema = require("../model/userSchema");
const emailValidation = require("../helpers/emailValidation");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { log } = require("console");
const emailVerification = require("../helpers/emailVerification");

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
  //  Duplicate Email Check Start
  // -------------First Way--------------
  // const duplicateEmail = await userSchema.findOne({ email });
  // if (duplicateEmail) {
  //   return res.json({
  //     message: "Error: Email Already Exists",
  //   });
  // }

  // -----------------Second Way ------------
  const duplicateEmail = await userSchema.find({ email });
  if (duplicateEmail.length > 0) {
    return res.json({
      message: "Error: Email Already Exists",
    });
  }
  //  Duplicate Email Check End

  // ------------Use crypto for send OTP Start-------------

  // First way using function Start
  // function generateOTP() {
  //   const otp = crypto.randomInt(100000, 999999).toString();
  //   const expiresOTP = new Date(Date.now() + 10 * 60 * 1000);
  //   return { otp, expiresOTP };
  // }
  // const { otp, expiresOTP } = generateOTP();
  // console.log("Generated OTP:", otp, "Expires at:", expiresOTP);
  // First way using function End

  // Second way without using function Start
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresOtp = new Date(Date.now() + 5 * 60 * 1000);
  console.log("Generated OTP:", otp, "Expires at:", expiresOtp);
  // Second way without using function End

  // ---------------Use crypto for send OTP End----------------

  bcrypt.hash(password, 10, function (err, hash) {
    const users = new userSchema({
      firstName,
      lastName,
      email,
      password: hash,
      // otp: generateOTP(), // First Way Using Function
      otp, // Second Way Without Function
      expireOtp: expiresOtp,
    });
    emailVerification(email, otp);
    users.save();
    res.json({
      messege: "Data Send",
    });
  });
};

module.exports = signupController;
