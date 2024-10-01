const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    code: {
      type: Schema.Types.ObjectId,
      ref: "CodeTask",
      required: true,
    },
    deadline: {
      type: Date,
      default: new Date(),
    },
    name: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    dateCompleted: {
      type: Date,
      default: null,
    },
    place: {
      type: String,
      default: "",
    },
    amountPaid: {
      type: mongoose.Types.Decimal128,
      default: 0.0,
      get: getAmount,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
  },
  {
    toObject: {
      transform: (doc, ret) => {},
    },
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        //delete ret.isActive;
      },
    },
  }
);

function getAmount(value) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }

  return value;
}

const Task = mongoose.model("Task", taskSchema);
module.exports = { Task, taskSchema };
