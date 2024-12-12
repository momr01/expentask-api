const ID_COMPROBANTE = "6626c616db4828b66d9ac7e8";
const ID_PAGAR = "6626c59ddb4828b66d9ac7e6";
const ID_FACTURA = "6626c5fcdb4828b66d9ac7e7";
const ID_MAIL = "6626c642db4828b66d9ac7eb";

const ID_USER = "6542b6a9cd1b77e631389710";

const { Name } = require("../model/NamePayment");
const Payment = require("../model/Payment");
const { Category } = require("../model/Category");
const { TaskCode } = require("../model/TaskCode");

const { default: mongoose } = require("mongoose");

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

    /* let payments = await Payment.aggregate([
      {
        $addFields: {
          amount: {
            $toString: "$amount",
          },
        },
      },
      {
        $unset: ["__v"],
      },
      {
        $lookup: {
          from: "names",
          localField: "name",
          foreignField: "_id",
          as: "name",
          pipeline: [
            {
              $unset: ["dataEntry", "__v"],
            },
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
                pipeline: [
                  {
                    $unset: ["dataEntry", "__v"],
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $unwind: "$tasks",
      },
      {
        $addFields: {
          "tasks.amountPaid": {
            $toString: "$tasks.amountPaid", // Convierte amountPaid a string
          },
        },
      },
      {
        $lookup: {
          from: "taskcodes",
          localField: "tasks.code",
          foreignField: "_id",
          as: "code",
        },
      },
      {
        $set: {
          "tasks.code": "$code",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $unset: ["password", "isActive", "dataEntry", "payments", "__v"],
            },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          name: {
            $first: "$name",
          },
          deadline: {
            $first: "$deadline",
          },
          isActive: {
            $first: "$isActive",
          },
          amount: {
            $first: "$amount",
          },
          isCompleted: {
            $first: "$isCompleted",
          },
          user: {
            $first: "$user",
          },
          period: {
            $first: "$period",
          },
          tasks: { $push: "$tasks" },
          dateCompleted: {
            $first: "$dateCompleted",
          },
          dataEntry: {
            $first: "$dataEntry",
          },
        },
      },
    ]);*/

    // let payments = await Payment.find({});

    // for (let payment of payments) {
    //   for (let task of payment.tasks) {

    //     task.amountPaid = payment.amount;
    //   }
    //   payment.save();
    // }

    /*

    let payments = await Payment.find({});

    for (let payment of payments) {
      for (let task of payment.tasks) {
        if (task.code == "6626c59ddb4828b66d9ac7e6") {
          // console.log(" SI");
          task.amountPaid = payment.amount;
        } else {
          task.amountPaid = 0;
        }

        // task.amountPaid = payment.amount;
      }
      //console.log(payment);
       payment.save();
    }

    res.json(payments);*/
/*
    // agregar installments a payment y tasks
    let payments = await Payment.find({});
    for (let payment of payments) {
      for (let task of payment.tasks) {
        task.instalmentNumber = 0;
      }
      await payment.save();
      console.log(payment);
    }
    console.log(payments.length)
    */




    /*
    //agregar cantidad de cuotas a pagos
    let payments = await Payment.find({});
    for (let payment of payments) {
      payment.save();
    }*/

    /*
    //agregar todos los pagos de cada cuota
    let payments = await Payment.find({});
    for (let payment of payments) {
      if (payment.hasInstallments) {
        console.log(payment);

        for (let index = 3; index < 19; index++) {
          const taskSchema1 = {
            code: "65e3405d73963e0fdcee8a12",
            deadline: new Date(2025, index - 1, 0),
            paymentId: payment._id,
            instalmentNumber: index,
          };
          const taskSchema2 = {
            code: "65e6448073963e0fdcee8a34",
            deadline: new Date(2025, index - 1, 0),
            paymentId: payment._id,
            instalmentNumber: index,
          };

          payment.tasks.push(taskSchema1);
          payment.tasks.push(taskSchema2);
        }

        // const taskSchema1 = {
        //   code: "65e3405d73963e0fdcee8a12",
        //   deadline: new Date(2025, 1, 0),
        //   paymentId: payment._id,
        //   instalmentNumber: 3,
        // };
        // const taskSchema2 = {
        //   code: "65e6448073963e0fdcee8a34",
        //   deadline: new Date(2025, 1, 0),
        //   paymentId: payment._id,
        //   instalmentNumber: 3,
        // };

        // payment.tasks.push(taskSchema1);
        // payment.tasks.push(taskSchema2);

        console.log(payment);
        payment.save();
      }
    }*/

    /*  ;*/


    /*
    //pasar user a allowedusers
    let taskcodes = await TaskCode.find({});

    for (let code of taskcodes) {
      code.allowedUsers = code.user;
      await code.save();
    }

    console.log(taskcodes);*/

    res.json({ message: "OK" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateDB,
};
