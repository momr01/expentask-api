const {Task} = require("../model/Task");

//get all task
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.query.user });
    if (tasks.length < 1)
      return res.status(204).json({ message: "No tasks were found" });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTasks,
};
