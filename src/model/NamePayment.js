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
    dataEntry: {
      type: String,
      default: new Date(),
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

module.exports = mongoose.model("Name", namePaymentSchema);
