const mongoose = require("mongoose");
const { taskSchema } = require("./Task");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    name: {
      type: Schema.Types.ObjectId,
      ref: "Name",
      required: true,
    },
    deadline: {
      type: Date,
      require: true,
    },
    amount: {
      type: mongoose.Types.Decimal128,
      default: 0.0,
      get: getAmount,
    },
    tasks: [taskSchema],
    /* tasks: {
      type: Object,
      default: {
        pay: {
          id: 1,
          name: "Pagar",
          deadline: new Date(),
          isActive: true,
          isCompleted: false,
          dateCompleted: null,
          place: "",
        },
        printBill: {
          id: 2,
          name: "Imprimir factura",
          deadline: new Date(),
          isActive: true,
          isCompleted: false,
          dateCompleted: null,
        },
        printProof: {
          id: 3,
          name: "Imprimir comprobante de pago",
          deadline: new Date(),
          isActive: true,
          isCompleted: false,
          dateCompleted: null,
        },
        sendEmail: {
          id: 4,
          name: "Enviar email",
          deadline: new Date(),
          isActive: true,
          isCompleted: false,
          dateCompleted: null,
        },
      },
    },*/
    isActive: {
      type: Boolean,
      default: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    dataEntry: {
      type: String,
      default: new Date(),
    },
    dateCompleted: {
      type: Date,
      default: null,
    },
    period: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          
          return value.length == 7;
        },
        message: "The period format is 'mm-yyyy'. Please try again!",
      },
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
      getters: true,
      transform: (doc, ret) => {
        ret.amount = ret.amount.toString();
        delete ret.dataEntry;
        delete ret.__v;
        delete ret.isActive;
      },
    },
    runGettersOnQuery: true,
  }
);

function getAmount(value) {
  if (typeof value !== "undefined") {
    return parseFloat(value.toString());
  }

  return value;
}

module.exports = mongoose.model("Payment", paymentSchema);
