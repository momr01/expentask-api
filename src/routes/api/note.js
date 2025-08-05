const express = require("express");
const router = express.Router();
const notesController = require("../../controllers/noteController");
const auth = require("../../middleware/auth");

router.route("/add").post(auth, notesController.addNote);

router.route("/getAll").get(auth, notesController.getAllNotes);

router.route("/edit/:id").put(auth, notesController.editNote);
router.route("/disable/:id").put(auth, notesController.disableNote);

router.route("/getPaymentNotes/:id").get(auth, notesController.getPaymentNotes);

router.route("/getNameNotes/:id").get(auth, notesController.getNameNotes);

module.exports = router;
