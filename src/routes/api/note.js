const express = require("express");
const router = express.Router();
const notesController = require("../../controllers/noteController");
const auth = require("../../middleware/auth");

router.route("/add").post(auth, notesController.addNote);

router.route("/getAll").get(auth, notesController.getAllNotes);

module.exports = router;
