const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    ram: {
      type: String,
    },
    storage: {
      type: String,
    },
    category: {
      type: String,
    },
    // variant: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ProductList", productSchema);
