const categorySchema = require("../model/categorySchema");
const subCategorySchema = require("../model/subCategorySchema");

// =========== Create SubCategory part start Here ===========
const createSubCategory = async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;
    if (!name || !description || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Name, description and categoryId are required.",
      });
    }
    const existingSubCategory = await subCategorySchema.findOne({ name });
    if (existingSubCategory) {
      return res.status(409).json({
        success: false,
        message: "SubCategory with this name already exists",
      });
    }
    const createsubcategory = new subCategorySchema({
      name,
      description,
      categoryId,
    });
    await categorySchema.findByIdAndUpdate(
      categoryId,
      { $push: { subCategories: createsubcategory._id } },
      { new: true },
    );
    createsubcategory.save();
    res.status(201).json({
      success: true,
      message: "SubCategory created successfully",
      createsubcategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error creating subcategory", error });
  }
};
// =========== Create SubCategory part End Here ==============
const getAllSubCategory = async (req, res) => {
  const allSubCategoryList = await subCategorySchema.find({});
  res.status(200).json({
    success: true,
    message: "All subcategories retrieved successfully",
    allSubCategoryList,
  });
};
module.exports = { createSubCategory, getAllSubCategory };
