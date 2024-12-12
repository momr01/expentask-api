const { default: mongoose } = require("mongoose");
const { Category } = require("../model/Category");
const { Name } = require("../model/NamePayment");
const { idsAreIncorrect } = require("../helpers/functions");
const { TaskCode } = require("../model/TaskCode");
const Payment = require("../model/Payment");

/**
 * Add a new payment name
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addName = async (req, res) => {
  try {
    //1. getting data from body
    const { name, categoryId, defaultTasks } = req.body;

    //2. checking if name already exists
    const nameExists = await Name.findOne({
      name: name,
      user: req.user,
      isActive: true,
    });
    if (nameExists) {
      return res
        .status(409)
        .json({ message: "A name with same data already exists." });
    }

    //3. checking if category already exists
    const categoryExists = await Category.findOne({
      _id: categoryId,
      user: req.user,
      isActive: true,
    });
    if (!categoryExists) {
      return res.status(400).json({ message: "The category doesn't exist." });
    }

    //4. checking if defaulttasks is empty
    if (defaultTasks.length < 1) {
      return res
        .status(400)
        .json({ message: "There is a problem with the default tasks." });
    }

    //5. checking if every task inside defaulttasks is unique
    let unique = [...new Set(defaultTasks)];
    if (unique.length != defaultTasks.length) {
      return res
        .status(400)
        .json({ message: "You can not duplicate the tasks." });
    }

    //6. checking if every task inside defaulttasks already exists
    for (const task of defaultTasks) {
      const taskcodeExists = await TaskCode.findOne({
        _id: task,
        user: req.user,
        isActive: true,
      });
      if (!taskcodeExists) {
        return res
          .status(400)
          .json({ message: "There is a problem with the default tasks." });
      }
    }

    //7. creating the new name
    let newName = new Name({
      name,
      category: categoryId,
      defaultTasks,
      user: req.user,
    });

    //8. saving the new name
    newName = await newName.save();

    //9. response
    res.status(201).json(newName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * get one name by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getName = async (req, res) => {
  try {
    //1. getting data from params
    const { id } = req.params;

    const name = await Name.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          isActive: true,
          user: new mongoose.Types.ObjectId(req.user),
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
          pipeline: [
            {
              $unset: ["dataEntry", "__v", "isActive"],
            },
          ],
        },
      },
    ]);
    res.status(200).json(name);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all names of payments
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllNames = async (req, res) => {
  try {
    const names = await Name.aggregate([
      {
        $match: {
          isActive: true,
          user: new mongoose.Types.ObjectId(req.user),
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
    ]);
    res.status(200).json(names);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Edit one name
 * @param {*} req
 * @param {*} res
 * @returns
 */
const editName = async (req, res) => {
  try {
    //1. getting data from body and params
    const { name, category, defaultTasks } = req.body;
    const { id } = req.params;

    //2. checking if the name exists
    let nameExists = await Name.findOne({
      _id: id,
      user: req.user,
      isActive: true,
    });
    if (!nameExists) {
      return res.status(400).json({ message: "The name does not exist." });
    }

    //3. checking if the category exists
    const categoryExists = await Category.findOne({
      _id: category,
      user: req.user,
      isActive: true,
    });
    if (!categoryExists) {
      return res.status(400).json({ message: "The category does not exist." });
    }

    //4. checking if defaulttasks is empty
    if (defaultTasks.length < 1) {
      return res
        .status(400)
        .json({ message: "There is a problem with the default tasks." });
    }

    //5. checking if every task inside defaulttasks exists
    for (const task of defaultTasks) {
      const taskcodeExists = await TaskCode.findOne({
        _id: task,
        //user: req.user,
        allowedUsers: req.user,
        isActive: true,
      });
      if (!taskcodeExists) {
        return res
          .status(400)
          .json({ message: "There is a problem with the default tasks." });
      }
    }

    //6. updating the information
    nameExists.name = name;
    nameExists.category = category;
    nameExists.defaultTasks = defaultTasks;

    //7. saving data
    await nameExists.save();

    res.status(201).json({ message: "Name updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Disable the name
 * @param {*} req
 * @param {*} res
 * @returns
 */
const disableName = async (req, res) => {
  try {
    //1. getting data from params
    const { id } = req.params;

    //2. checking if the name exists
    let nameExists = await Name.findOne({
      _id: id,
      isActive: true,
      user: req.user,
    });
    if (!nameExists) {
      return res
        .status(400)
        .json({ message: "The name doesn't exist or is already inactive." });
    }

    //3. checking if name is used in at least one payment
    let nameIsUsed = await Payment.findOne({
      isActive: true,
      isCompleted: false,
      name: id,
    });
    if (nameIsUsed) {
      return res.status(400).json({
        message:
          "At least one payment is using the name. You can not delete it!",
      });
    }

    //4. updating the name
    nameExists.isActive = false;

    //5. saving changes
    await nameExists.save();

    //6. response
    res.status(200).json({ message: "Name was disabled successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addName,
  getAllNames,
  getName,
  editName,
  disableName,
};
