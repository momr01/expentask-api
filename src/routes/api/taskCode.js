const express = require("express");
const router = express.Router();
const taskCodeController = require("../../controllers/taskCodeController");
const auth = require("../../middleware/auth");

router.route("/getAll").get(auth, taskCodeController.getAllTaskCodes);

router.route("/add").post(auth, taskCodeController.createTaskCode);

module.exports = router;
