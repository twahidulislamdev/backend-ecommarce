const express = require("express");
const userSchema = require("../model/userSchema");
const emailValidation = require("../helpers/emailValidation");
const router = express.Router();
const bcrypt = require("bcrypt");

const signupController = (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  bcrypt.hash(password, 10, function (err, hash) {
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
      password: hash,
    });

    users.save();
    res.json({
      messege: "Data Send",
    });
  });
};

module.exports = signupController;
