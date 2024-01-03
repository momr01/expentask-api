const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/categoryController");

router.route("/getAll").get(categoryController.getAllCategories);

router.route("/add").post(categoryController.addCategory);

module.exports = router;
