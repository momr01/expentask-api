const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    firstNames: {
      type: String,
    },
    lastNames: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    dataEntry: {
      type: String,
      default: new Date(),
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
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

module.exports = mongoose.model("User", userSchema);
