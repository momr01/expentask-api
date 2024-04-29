const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

authRouter.post("/api/signup", authController.signUp);

authRouter.post("/api/signin", authController.signIn);

authRouter.post("/tokenIsValid", authController.tokenIsValid);

authRouter.get("/api/get-user-data", auth, authController.getUserData);



module.exports = authRouter;
