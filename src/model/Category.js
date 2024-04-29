const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
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

const Category = mongoose.model("Category", categorySchema);
module.exports = { Category, categorySchema };