const express = require("express");
const productSchema = require("../model/productSchema");

// ====================== Product Creation Controller start Here ======================
const createProduct = async (req, res) => {
  const { name, description, price, size, color, category, ram, storage } =
    req.body;
  if (
    !name ||
    !description ||
    !price ||
    !size ||
    !color ||
    !category ||
    !ram ||
    !storage
  ) {
    return res.status(400).json({
      message:
        "Error: All required fields (name, description, price, size, color, category, ram, Storage) are required",
    });
  }
  const existingProduct = await productSchema.findOne({ name });
  if (existingProduct) {
    return res.status(400).json({ message: "Error: Product already exists" });
  }
  const createNewProduct = new productSchema({
    name,
    description,
    price,
    size,
    color,
    category,
    ram,
    storage,
  });
  await createNewProduct
    .save()
    .then((data) => {
      res.status(201).json({ message: "Product created successfully", data });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error creating product", error });
    });
};
// ====================== Product Creation Controller End Here ======================
module.exports = createProduct;
