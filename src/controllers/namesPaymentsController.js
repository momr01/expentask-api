const { default: mongoose } = require("mongoose");
const Category = require("../model/Category");
const Name = require("../model/NamePayment");
const { checkingIdFormat, checkingArrayIds } = require("../helpers/functions");

//create a new name of payment
const addName = async (req, res) => {
  if (!req?.body?.name || !req?.body?.categoryId) {
    return res.status(400).json({ message: "Please verify the required data" });
  }

  const nameExists = await Name.findOne({
    name: req.body.name,
  }).exec();

  if (nameExists != null) {
    return res.status(409).json({ message: "The name already exists." });
  }

  const idFormat = await checkingIdFormat(req.body.categoryId);
  if (idFormat.errors.length > 0)
    return res.status(400).json({ message: "The id format is not correct." });

  const categoryExists = await Category.findById(req.body.categoryId).exec();
  if (categoryExists == null)
    return res
      .status(500)
      .json({ message: "The name of the category is not correct." });

  try {
    const result = await Name.create({
      name: req.body.name,
      category: req.body.categoryId,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "There was an error. Please try again later." });
  }
};

//get one name by id
const getName = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Please check the required data." });
  }

  const idFormat = await checkingIdFormat(req.params.id);
  if (idFormat.errors.length > 0)
    return res.status(400).json({ message: "The id format is not correct." });

  try {
    let name = await Name.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $unset: ["dataEntry", "__v"],
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
          pipeline: [
            {
              $unset: ["dataEntry", "__v", "isActive"],
            },
          ],
        },
      },
    ]);
    return res.json(name);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There ir an error. Please try again later." });
  }
};

//get names of payments
const getAllNames = async (req, res) => {
  try {
    const names = await Name.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $unset: ["dataEntry", "__v"],
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
    ]).exec();

    if (names.length < 1)
      return res.status(404).json({ message: "No names were found" });
    res.json(names);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//edit the name
const editName = async (req, res) => {
  if (!req?.params?.id || !req?.body?.name || !req?.body?.category)
    return res.status(400).json({ message: "Please check the required data." });

  const idsFormat = await checkingArrayIds([req.params.id, req.body.category]);
  if (idsFormat.length > 0)
    return res.status(400).json({
      message:
        "The id name format and/or the id category format are not correct.",
    });

  const nameExists = await Name.findById(req.params.id).exec();
  if (nameExists.length < 1) {
    return res.status(404).json({ message: "The name does not exist." });
  }

  if (!nameExists.isActive) {
    return res.status(403).json({ message: "The name is not available." });
  }

  const categoryExists = await Category.findById(req.body.category).exec();
  if (categoryExists.length < 1) {
    return res.status(404).json({ message: "The category does not exist." });
  }

  if (!categoryExists.isActive) {
    return res.status(403).json({ message: "The category is not available." });
  }

  try {
    await Name.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      category: req.body.category,
    }).exec();

    return res.status(201).json({ message: "Name updated successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There was an error. Please try again later." });
  }
};

//delete one name or disable
const disableName = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Please check the required data." });
  }

  const idFormat = await checkingIdFormat(req.params.id);
  if (idFormat.errors.length > 0)
    return res.status(400).json({ message: "The id is not correct." });

  const nameActive = await Name.findById(req.params.id).exec();

  if (nameActive.length < 1) {
    return res.status(404).json({ message: "The name does not exist." });
  }

  if (!nameActive.isActive) {
    return res
      .status(403)
      .json({ message: "The name is already inactive." });
  }

  try {
    await Name.findByIdAndUpdate(req.params.id, {
      isActive: false,
    }).exec();

    return res
      .status(200)
      .json({ message: "The name was disabled correctly." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error happened. Please try again later!." });
  }
};

module.exports = {
  addName,
  getAllNames,
  getName,
  editName,
  disableName
};
