const express = require("express");
const router = express.Router();
const groupsController = require("../../controllers/groupController");
const auth = require("../../middleware/auth");

router.route("/add").post(auth, groupsController.addGroup);

router.route("/getActive").get(auth, groupsController.getActiveGroups);

router.route("/edit/:id").put(auth, groupsController.editGroup);

router.route("/disable/:id").put(auth, groupsController.disableGroup);

module.exports = router;
