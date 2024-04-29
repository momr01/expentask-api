const {Category} = require("../model/Category");

/**
 * Create a new category
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addCategory = async (req, res) => {
  try {
    //1. getting data from body
    const { name } = req.body;

    if(!name){
      return res.status(400).json({ message: "The name is required." });
    }

    //2. checking if the category already exists
    const categoryExists = await Category.findOne({
      name: name,
      user: req.user,
    });
    if (categoryExists) {
      return res.status(409).json({ message: "The category already exists." });
    }

    //3. creating new category
    let newCategory = new Category({
      name: name,
      user: req.user,
    });
    newCategory = newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all the categories
 * @param {*} req 
 * @param {*} res 
 */
const getAllCategories = async (req, res) => {
  try {
    //1. getting data from db
    const categories = await Category.find({ user: req.user });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCategories,
  addCategory,
};
