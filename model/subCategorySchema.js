const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const subCategorySchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CategoryList",
  },
});
module.exports = mongoose.model("SubCategoryList", subCategorySchema);
