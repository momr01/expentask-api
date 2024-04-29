const { TaskCode } = require("../model/TaskCode");

/**
 * Get all task codes
 * @param {*} req
 * @param {*} res
 */
const getAllTaskCodes = async (req, res) => {
  try {
    const codes = await TaskCode.find({ user: req.user, isActive: true });
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
    const currentCodes = await TaskCode.find();
    if (currentCodes.length > 0) {
      number = currentCodes[currentCodes.length - 1].number + 1;
    }

    const taskCodeExists = await TaskCode.findOne({
      name,
      user: req.user,
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
    });

    newTaskCode = await newTaskCode.save();
    
    res.status(201).json(newTaskCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTaskCodes,
  createTaskCode,
};
