const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const amountSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: mongoose.Types.Decimal128,
      default: 0.0,
      get: getAmount,
    },
    date: {
      type: Date,
      require: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    dataEntry: {
      type: String,
      default: new Date(),
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
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
        //delete ret.dataEntry;
        // delete ret.__v;
        //delete ret.payment;
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

const Amount = mongoose.model("Amount", amountSchema);
module.exports = { Amount, amountSchema };
