const { default: mongoose } = require("mongoose");
const { TaskCode } = require("../model/TaskCode");

/**
 * Get all task codes
 * @param {*} req
 * @param {*} res
 */
const getActiveOwnTaskCodes = async (req, res) => {
  try {
    const codes = await TaskCode.find({
      user: req.user,
      isActive: true,
      //  allowedUsers: req.user,
    }).sort({
      number: 1,
    });
    res.status(200).json(codes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all task codes
 * @param {*} req
 * @param {*} res
 */
const getActiveUsableTaskCodes = async (req, res) => {
  try {
    const codes = await TaskCode.find({
      //user: req.user,
      isActive: true,
      allowedUsers: req.user,
    }).sort({
      number: 1,
    });
    res.status(200).json(codes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create one new task code
 * @param {*} req
 * @param {*} res
 */
const createTaskCode = async (req, res) => {
  try {
    const { name, abbr } = req.body;

    let number = 1;
    const currentCodes = await TaskCode.find({
      isActive: true,
      // user: req.user,
      allowedUsers: req.user,
    });
    if (currentCodes.length > 0) {
      number = currentCodes[currentCodes.length - 1].number + 1;
    }

    const taskCodeExists = await TaskCode.findOne({
      name,
      // user: req.user,
      allowedUsers: req.user,
      isActive: true,
    });
    if (taskCodeExists) {
      return res
        .status(409)
        .json({ msg: "TaskCode with same data already exists!" });
    }

    let newTaskCode = new TaskCode({
      name: name,
      number,
      abbr: abbr,
      user: req.user,
      allowedUsers: req.user,
    });

    newTaskCode = await newTaskCode.save();

    res.status(201).json(newTaskCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Edit one task code
 * @param {*} req
 * @param {*} res
 * @returns
 */
const editTaskCode = async (req, res) => {
  try {
    //1. getting data from body and params
    const { name, abbr, number } = req.body;
    const { id } = req.params;

    //2. checking if the task code exists
    let taskCodeExists = await TaskCode.findOne({
      _id: id,
      user: req.user,
      //  allowedUsers: req.user,
      isActive: true,
    });
    if (!taskCodeExists) {
      return res.status(400).json({ message: "The task code does not exist." });
    }

    //3. checking every param is complete with data
    if (!name || !abbr || !number) {
      return res
        .status(400)
        .json({ message: "Please, complete the required data." });
    }

    //4. checking if the number exists
    const numberExists = await TaskCode.findOne({
      number,
      // user: req.user,
      allowedUsers: req.user,
      isActive: true,
    });

    //console.log(numberExists);

    // console.log(numberExists._id.toString() === id);
    if (numberExists) {
      if (numberExists._id.toString() !== id) {
        return res.status(400).json({
          message: "The number is already in use. Please choose another one.",
        });
      }
    }

    const taskWithSameData = await TaskCode.find({
      name,
      // user: req.user,
      allowedUsers: { $in: [req.user] },
      isActive: true,
    });
    console.log(taskWithSameData);
    if (taskWithSameData.length > 0) {
      if (taskWithSameData.length > 1) {
        return res
          .status(409)
          .json({ msg: "11TaskCode with same data already exists!" });
      } else {
        console.log(taskWithSameData[0]._id.toString());
        console.log(new mongoose.Types.ObjectId(id));
        if (taskWithSameData[0]._id.toString() !== id) {
          return res
            .status(409)
            .json({ msg: "22TaskCode with same data already exists!" });
        }
      }
    }

    //5. updating the information
    taskCodeExists.name = name;
    taskCodeExists.abbr = abbr;
    taskCodeExists.number = number;

    //7. saving data
    await taskCodeExists.save();

    res.status(201).json({ message: "Task code updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Disbale one task code
 * @param {*} req
 * @param {*} res
 * @returns
 */
const disableTaskCode = async (req, res) => {
  try {
    // 1. getting data from params
    const { id } = req.params;

    //2. checking the user permission and the state of the task code
    let taskCodeActive = await TaskCode.findOne({
      _id: id,
      user: req.user,
      isActive: true,
    });
    if (!taskCodeActive) {
      return res.status(400).json({ message: "The task code does not exist." });
    }

    //3. change the state of the payment
    taskCodeActive.isActive = false;

    //4. saving the data
    await taskCodeActive.save();

    res.status(204).json({ message: "The task code was disabled correctly." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getActiveOwnTaskCodes,
  getActiveUsableTaskCodes,
  createTaskCode,
  editTaskCode,
  disableTaskCode,
};
