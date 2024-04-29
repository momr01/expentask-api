const express = require("express");
const overallRouter = express.Router();
const overallController = require("../controllers/overallController");

overallRouter.post("/api/db/update", overallController.updateDB);

module.exports = overallRouter;
