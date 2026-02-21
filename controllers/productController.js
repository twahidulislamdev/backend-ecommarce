const express = require("express");
const productSchema = require("../model/productSchema");

// ====================== Product Creation Controller start Here ======================
const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    size,
    color,
    category,
    ram,
    storage,
    image,
  } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({
      message:
        "Error: All required fields (Name, Description, Price, Category) are Required",
    });
  }

  const existingProduct = await productSchema.findOne({ name });
  if (existingProduct) {
    return res.status(400).json({ message: "Error: Product Already Exists" });
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
    image: `http://localhost:3000/uploads/${req.file.filename}`,
  });
  await createNewProduct
    .save()
    .then((data) => {
      res.status(201).json({ message: "Product Created Successfully", data });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error Creating Product", error });
    });
};
// ====================== Product Creation Controller End Here ======================

// ====================== GetAll Product Controller End Here ========================
const getAllProducts = async (req, res) => {
  try {
    const products = await productSchema.find({});
    res
      .status(200)
      .json({ message: "Products Retrieved Successfully", products });
  } catch (error) {
    res.status(500).json({ message: "Error Retrieving Products", error });
  }
};
// ====================== GetAll Product Controller End Here ========================

// ====================== Update Product Controller Start Here ========================
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, size, color, category, ram, storage } =
    req.body;
  try {
    const product = await productSchema
      .findByIdAndUpdate(
        id,
        { name, description, price, size, color, category, ram, storage },
        { new: true },
      )
      .exec();
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    res.status(200).json({ message: "Product Updated Successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error Updating Product", error });
  }
};
// ====================== Update Product Controller End Here ========================

// ====================== single Product Delete Controller Start Here ===============
const deleteSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const singleDeletedProduct = await productSchema.findByIdAndDelete(id);
    if (!singleDeletedProduct) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    res.status(200).json({
      message: "Product Deleted Successfully",
      DeletedProduct: singleDeletedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error Deleting Product", error });
  }
};
// ====================== single Product Delete Controller End Here ===================

// ====================== Delete Product Controller Start Here ===================
const deleteAllProducts = async (req, res) => {
  try {
    const allDeletedProducts = await productSchema.deleteMany({});
    res.status(200).json({
      message: "All Products Deleted Successfully",
      result: allDeletedProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error Deleting Products", error });
  }
};
// ====================== Delete Product Controller End Here ===================

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteSingleProduct,
  deleteAllProducts,
};
