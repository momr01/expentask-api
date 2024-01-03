const Category = require("../model/Category");

//add a new category
const addCategory = async (req, res) => {
  if (!req?.body?.name) {
    return res.status(400).json({ message: "Please verify the required data" });
  }

  const categoryExists = await Category.findOne({
    name: req.body.name,
  }).exec();

  if (categoryExists) {
    return res.status(409).json({ message: "The category already exists." });
  }

  try {
    const result = await Category.create({
      name: req.body.name,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length < 1)
      return res.status(204).json({ message: "No categories were found" });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCategories,
  addCategory,
};
