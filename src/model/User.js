const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => {
          const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          return value.match(re);
        },
        message: "Please enter a valid email address", //only if match is not true
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          return value.length > 6;
        },
        message: "Please enter a valid password with more than 6 characters",
      },
    },
    name: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          let textToArray = value.split(" ");
          return textToArray.length >= 2;
        },
        message: "Please enter your name and surname",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    dataEntry: {
      type: String,
      default: new Date(),
    },
    type: {
      type: String,
      default: "user",
    },
    // payments: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Payment",
    //   },
    // ],
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.dataEntry;
        delete ret.__v;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);
module.exports = { User, userSchema };
