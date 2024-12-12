const express = require("express");
const router = express.Router();
const taskCodeController = require("../../controllers/taskCodeController");
const auth = require("../../middleware/auth");

router
  .route("/getActiveOwn")
  .get(auth, taskCodeController.getActiveOwnTaskCodes);

router
  .route("/getActiveUsable")
  .get(auth, taskCodeController.getActiveUsableTaskCodes);

router.route("/add").post(auth, taskCodeController.createTaskCode);

router.route("/editTaskCode/:id").put(auth, taskCodeController.editTaskCode);

router
  .route("/disableTaskCode/:id")
  .put(auth, taskCodeController.disableTaskCode);

module.exports = router;
