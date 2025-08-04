const express = require("express");
const router = express.Router();
const amountController = require("../../controllers/amountController");
const auth = require("../../middleware/auth");

router.route("/getAll").get(auth, amountController.getAllAmounts);

router.route("/add").post(auth, amountController.addAmountDetail);

router
  .route("/getPaymentAmounts/:id")
  .get(auth, amountController.getPaymentAmounts);

router.route("/edit/:id").put(auth, amountController.editPaymentAmount);

router.route("/disable/:id").put(auth, amountController.disablePaymentAmount);

module.exports = router;
