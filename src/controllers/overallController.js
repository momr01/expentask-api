const ID_COMPROBANTE = "6626c616db4828b66d9ac7e8";
const ID_PAGAR = "6626c59ddb4828b66d9ac7e6";
const ID_FACTURA = "6626c5fcdb4828b66d9ac7e7";
const ID_MAIL = "6626c642db4828b66d9ac7eb";

const ID_USER = "6542b6a9cd1b77e631389710";

const { Name } = require("../model/NamePayment");
const Payment = require("../model/Payment");
const { Category } = require("../model/Category");
const { TaskCode } = require("../model/TaskCode");

const updateDB = async (req, res) => {
  try {
    //1. agregar periodo a payment
    // let payments = await Payment.find({});

    // for (let payment of payments) {
    //     payment.period = "10-2025";
    //     await payment.save();
    // }

    //2. borrar todo en payment
    // await Payment.deleteMany({});

    //3. agregar periodo y task code a cada payment, segun fecha de vto
    /*  let payments = await Payment.find({ deadline: "2024-02-10" });

    for (let el of payments) {
      el.period = "02-2024";

      for (let task of el.tasks) {
        task.paymentId = el._id;

        switch (task.name) {
          case "Pagar": 
            task.code = ID_PAGAR;
            break;
          case "Imprimir factura":
            task.code = ID_FACTURA;
            break;
          case "Imprimir comprobante de pago":
            task.code = ID_COMPROBANTE;
            break;
          case "Enviar email":
            task.code = ID_MAIL;
            break;
        }
      }
     el.save();
    }*/

    /*
    let names = await Name.find({});

    for (let name of names) {
      name.user = ID_USER;
      // name.user = "6542b6a9cd1b77e631389711";
      name.save();
    }
    */

    /*
    let payments = await Payment.find({});

    for (let payment of payments) {
      //  console.log(payment);
      payment.user = ID_USER;
      // payment.user = "6542b6a9cd1b77e631389711";
      payment.save();
    }
    */

    /*
    let categories = await Category.find({});

    for (let category of categories) {
      // console.log(category);
      category.user = ID_USER;
      //category.user = "6542b6a9cd1b77e631389711";
      category.save();
    }
    */

    /*
    let codes = await TaskCode.find({});

    for (let code of codes) {
      //  console.log(code);
      //code.user = "6542b6a9cd1b77e631389711";
      code.user = ID_USER;
      code.save();
    }
    */

    res.json({ message: "OK" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateDB,
};
