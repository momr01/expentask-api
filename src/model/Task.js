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
      type: String
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

const Task = mongoose.model("Task", taskSchema);
module.exports = { Task, taskSchema };
