const express = require("express");
const router = express.Router();
const namesController = require("../../controllers/namePaymentController");
const auth = require("../../middleware/auth");

router.route("/add").post(auth, namesController.addName);

router.route("/getAll").get(auth, namesController.getAllNames);

router.route("/get/:id").get(auth, namesController.getName);

router.route("/editName/:id").put(auth, namesController.editName);

router.route("/disableName/:id").put(auth, namesController.disableName);

module.exports = router;
