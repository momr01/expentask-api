const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");

router.route("/add").post(usersController.addUser);

module.exports = router;
