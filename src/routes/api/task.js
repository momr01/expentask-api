const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/taskController");
const auth = require("../../middleware/auth");

router.route("/getAll").get(auth, taskController.getAllTasks);


module.exports = router;
