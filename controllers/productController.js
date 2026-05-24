const express = require("express");
const productSchema = require("../model/productSchema");
const { uploadToCloudinary } = require("../middleware/cloudinary");
const uploadImage = require("../middleware/cloudinary");

// ====================== Product Creation Controller start Here ======================
const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    colors,
    sizes,
    ram,
    storage,
    category,
    tags,
    badge,
    stock,
    status,
  } = req.body;

  // Validate Required Fields
  if (!name || !description || !price || !category) {
    return res.status(400).json({
      message:
        "Error: All required fields (Name, Description, Price, Category) are Required",
    });
  }

  // Check If A Product With The Same Name Already Exists
  const existingProduct = await productSchema.findOne({ name });
  if (existingProduct) {
    return res.status(400).json({
      message: "Error: Product Already Exists",
    });
  }

  // ======== Upload The Image To Cloudinary =============
  let imgUrl;
  if (req.file) {
    const imgPath = req.file.path;
    imgUrl = await uploadImage(imgPath);
  }

  // ================= COLORS PARSE START =================
  let parsedColors = [];
  try {
    const parsed = colors ? JSON.parse(colors) : [];
    parsedColors = Array.isArray(parsed)
      ? parsed.map((color) => ({
          name: color.name || "",
          hex: color.hex || "#000000",
        }))
      : [];
  } catch (e) {
    parsedColors = [];
  }
  // ================= COLORS PARSE END =================

  // ================= SIZES PARSE START =================
  let parsedSizes = [];
  try {
    parsedSizes = sizes ? JSON.parse(sizes) : [];
  } catch (e) {
    parsedSizes = Array.isArray(sizes) ? sizes : [];
  }
  // ================= SIZES PARSE END =================

  // Create a new product 
  const createNewProduct = new productSchema({
    name,
    description,
    price,
    colors: parsedColors,
    sizes: parsedSizes,
    ram: ram || "",
    storage: storage || "",
    stock: stock || 0,
    status: status || "active",
    category,
    image: imgUrl ? imgUrl.secure_url : undefined,
    badge: badge || "",
    tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
  });

  await createNewProduct
    .save()
    .then((data) => {
      res.status(201).json({
        message: "Product Created Successfully",
        data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error Creating Product",
        error,
      });
    });
};
// ====================== Product Creation Controller End Here ======================

// ====================== GetAll Product Controller Start Here ======================
const getAllProducts = async (req, res) => {
  try {
    const products = await productSchema.find({});

    res.status(200).json({
      message: "Products Retrieved Successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Retrieving Products",
      error,
    });
  }
};
// ====================== GetAll Product Controller End Here ========================

// ====================== Update Product Controller Start Here ======================
const updateProduct = async (req, res) => {
  const { id } = req.params;
  // Extract Fields From Request Body, Providing Default Values To Avoid Undefined
  const {
    name,
    description,
    price,
    colors,
    sizes,
    ram,
    storage,
    stock,
    status,
    category,
    tags,
    badge,
  } = req.body || {};

  try {
    // ================= COLORS PARSE START =================
    let parsedColors = [];
    try {
      const parsed = colors ? JSON.parse(colors) : [];
      parsedColors = Array.isArray(parsed)
        ? parsed.map((color) => ({
            name: color.name || "",
            hex: color.hex || "#000000",
          }))
        : [];
    } catch (e) {
      parsedColors = [];
    }
    // ================= COLORS PARSE END =================

    // ================= SIZES PARSE START =================
    let parsedSizes = [];
    try {
      parsedSizes = sizes ? JSON.parse(sizes) : [];
    } catch (e) {
      parsedSizes = Array.isArray(sizes) ? sizes : [];
    }
    // ================= SIZES PARSE END =================

    const updateData = {
      name,
      description,
      price,
      colors: parsedColors,
      sizes: parsedSizes,
      ram: ram || "",
      storage: storage || "",
      stock: stock != null ? stock : undefined,
      status: status || undefined,
      category,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      badge: badge || "",
    };

    // if a new image was uploaded, upload it to cloudinary and include in updateData
    if (req.file) {
      const imgUrl = await uploadImage(req.file.path);
      updateData.image = imgUrl.secure_url;
    }

    const product = await productSchema
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }
    res.status(200).json({
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Updating Product",
      error,
    });
  }
};
// ====================== Update Product Controller End Here ========================

// ====================== single Product Delete Controller Start Here ===============
const deleteSingleProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const singleDeletedProduct = await productSchema.findByIdAndDelete(id);

    if (!singleDeletedProduct) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      message: "Product Deleted Successfully",
      DeletedProduct: singleDeletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Deleting Product",
      error,
    });
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
    res.status(500).json({
      message: "Error Deleting Products",
      error,
    });
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
