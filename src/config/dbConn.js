const mongoose = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://momr01:Heartstopper01@cluster0.koly3.mongodb.net/ExpensesManagement?retryWrites=true&w=majority";
//const MONGODB_URI =
// "mongodb+srv://momr01:Heartstopper01@cluster0.koly3.mongodb.net/TestingExpentask?retryWrites=true&w=majority";
// const MONGODB_URI_TESTING =
//   "mongodb+srv://momr01:Heartstopper01@cluster0.koly3.mongodb.net/Testing?retryWrites=true&w=majority";
const MONGODB_URI_TESTING =
  "mongodb+srv://momr01:Heartstopper01@cluster0.koly3.mongodb.net/TestingExpentask?retryWrites=true&w=majority";

const responseConsole = (message) => {
  let line = "";
  for (let index = 0; index < 20; index++) {
    line += "*";
  }

  console.log("");
  console.log(line);
  console.log(line);
  console.log("");
  console.log(message);
  console.log("");
  console.log(line);
  console.log(line);
  console.log("");
};

const connectDB = async () => {
  try {
    // await mongoose.connect(process.env.DATABASE_URI, {
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    responseConsole("WARNING!!!!! PRODUCTION Database!");
  } catch (err) {
    console.error(err);
  }
};

const connectDBTesting = async () => {
  try {
    await mongoose.connect(MONGODB_URI_TESTING, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    responseConsole("ATENTION!!! Testing Database!");
  } catch (err) {
    console.error(err);
  }
};

module.exports = { connectDB, connectDBTesting };
