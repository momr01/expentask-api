const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    nameAssociated: {
      type: Schema.Types.ObjectId,
      ref: "Name",
    },
    paymentAssociated: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    content: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
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
        //delete ret.dataEntry;
        // delete ret.__v;
        //delete ret.payment;
      },
    },
  }
);

const Note = mongoose.model("Note", noteSchema);
module.exports = { Note, noteSchema };
