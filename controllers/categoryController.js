const categorySchema = require("../model/categorySchema");

// =========== Create Category part start Here ===========
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required.",
      });
    }
    const existingCategory = await categorySchema.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category with this name already exists",
      });
    }
    const createcategory = new categorySchema({
      name,
      description,
    });
    createcategory.save();
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      createcategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error creating category", error });
  }
};
// =========== Create Category part End Here ==============

// =========== Get All Category part start Here ===========
const getAllCategory = async (req, res) => {
  const allCategoryList = await categorySchema.find({});
  res.status(200).json({
    success: true,
    message: "All categories retrieved successfully",
    allCategoryList,
  });
};
// =========== Get All Category part start Here ===========

// ============= Update Category part start Here =============
const updateCategory = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const { name, description } = req.body;
  const updateCategory = await categorySchema.findOne({ _id: id });
  if (!updateCategory) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }
  updateCategory.name = name;
  updateCategory.description = description;
  await updateCategory.save();
  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    updateCategory,
  });
};
// ============= Update Category part End Here =============

// ============= Delete Category part start Here =============
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const deleteCategory = await categorySchema.findOneAndDelete({ _id: id });
  if (!deleteCategory) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    deleteCategory,
  });
};
// ============= Delete Category part End Here =============

// ============= DeleteAll Category part start Here =============



module.exports = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
};
