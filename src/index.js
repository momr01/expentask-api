require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const { connectDB, connectDBTesting } = require("./config/dbConn");
const authRouter = require("./routes/auth");
const overallRouter = require("./routes/overall");
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Connect to Testing
//connectDBTesting();

// custom middleware logger
//app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
//app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());
//middleware for cookies
//app.use(cookieParser());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use(authRouter);
app.use(overallRouter);
app.use("/api/payments", require("./routes/api/payment"));
app.use("/api/users", require("./routes/api/user"));
app.use("/api/names", require("./routes/api/name"));
app.use("/api/categories", require("./routes/api/category"));
app.use("/api/task-codes", require("./routes/api/taskCode"));
app.use("/api/tasks", require("./routes/api/task"));
app.use("/api/groups", require("./routes/api/group"));
app.use("/api/notes", require("./routes/api/note"));

//app.use(verifyJWT);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

//testing
/*
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
*/

/*
module.exports = { app
  //, server 
};
*/
