const express = require("express");
const userSchema = require("../model/userSchema");
const emailValidation = require("../helpers/emailValidation");
const router = express.Router();

const signupController = (req, res) => {
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

  const users = new userSchema({
    firstName,
    lastName,
    email,
    password,
  });

  users.save();
  res.json({
    data: users,
  });
};

module.exports = signupController;
