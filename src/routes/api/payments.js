const express = require("express");
const router = express.Router();
const paymentsController = require("../../controllers/paymentsController");

router.route("/add").post(paymentsController.addPayment);

router.route("/get/:id").get(paymentsController.getPayment);

router.route("/getAll").get(paymentsController.getAllPayments);

router.route("/getUndonePayments").get(paymentsController.getUndonePayments);

router.route("/completeTask/:id").put(paymentsController.completeTask);

router.route("/disablePayment/:id").put(paymentsController.disablePayment);

router.route("/editPayment/:id").put(paymentsController.editPayment);

router.route("/getAlerts").get(paymentsController.createAlerts);

module.exports = router;
