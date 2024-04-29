const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const namePaymentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      //default: "main",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    defaultTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "TaskCode",
        required: true,
      },
    ],
    dataEntry: {
      type: String,
      default: new Date(),
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toObject: {
      transform: (doc, ret) => {},
    },
    toJSON: {
      transform: (doc, ret) => {
        delete ret.dataEntry;
        delete ret.__v;
        delete ret.isActive;
        delete ret._id;
        //delete ret.payment;
      },
    },
  }
);

//module.exports = mongoose.model("Name", namePaymentSchema);
const Name = mongoose.model("Name", namePaymentSchema);
module.exports = { Name, namePaymentSchema };
