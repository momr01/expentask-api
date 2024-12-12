const express = require("express");
const router = express.Router();
const paymentsController = require("../../controllers/payment/paymentController");
const auth = require("../../middleware/auth");

router
  .route("/add-individual")
  .post(auth, paymentsController.addIndividualPayments);
router
  .route("/add-installments")
  .post(auth, paymentsController.addPaymentsWithInstallments);
router.route("/get/:id").get(auth, paymentsController.getPayment);
router.route("/getAll").get(auth, paymentsController.getAllPayments);
router
  .route("/getUndonePayments")
  .get(auth, paymentsController.getUndonePayments);
router.route("/completeTask/:id").put(auth, paymentsController.completeTask);
router
  .route("/disablePayment/:id")
  .put(auth, paymentsController.disablePayment);
router.route("/editPayment/:id").put(auth, paymentsController.editPayment);
router.route("/getAlerts").get(auth, paymentsController.createAlerts);
router.route("/totalAlerts").get(auth, paymentsController.numberOfAlerts);

module.exports = router;
