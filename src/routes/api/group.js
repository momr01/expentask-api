const express = require("express");
const router = express.Router();
const groupsController = require("../../controllers/groupController");
const auth = require("../../middleware/auth");

router.route("/add").post(auth, groupsController.addGroup);

router.route("/getAll").get(auth, groupsController.getAllGroups);

module.exports = router;
