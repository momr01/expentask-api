const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/categoryController");
const auth = require("../../middleware/auth");

router.route("/getAll").get(auth, categoryController.getAllCategories);

router.route("/add").post(auth, categoryController.addCategory);

router
  .route("/disableCategory/:id")
  .put(auth, categoryController.disableCategory);
router.route("/editCategory/:id").put(auth, categoryController.editCategory);

module.exports = router;
