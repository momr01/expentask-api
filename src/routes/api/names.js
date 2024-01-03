const express = require("express");
const router = express.Router();
const namesController = require("../../controllers/namesPaymentsController");

router.route("/add").post(namesController.addName);

router.route("/getAll").get(namesController.getAllNames);

router.route("/get/:id").get(namesController.getName);

router.route("/editName/:id").put(namesController.editName);

router.route("/disableName/:id").put(namesController.disableName);

module.exports = router;
