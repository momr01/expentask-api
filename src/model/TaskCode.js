const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskCodeSchema = new Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    abbr: {
      type: String,
      required: true,
    },
    dataEntry: {
      type: String,
      default: new Date(),
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    allowedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        // required: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    toObject: {
      transform: (doc, ret) => {},
    },
    toJSON: {
      transform: (doc, ret) => {
        //delete ret.dataEntry;
        // delete ret.__v;
        //delete ret.payment;
      },
    },
  }
);

const TaskCode = mongoose.model("TaskCode", taskCodeSchema);
module.exports = { TaskCode, taskCodeSchema };
