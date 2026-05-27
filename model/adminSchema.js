const express = require("express");
const { Admin } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  expireOtp: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "active",
    enum: ["new", "active", "inactive", "blocked"],
  },
  role: {
    type: String,
    default: "admin",
    enum: ["user", "admin"],
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("adminList", adminSchema);
