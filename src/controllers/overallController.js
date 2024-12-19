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

    // const payments = await Payment.find({
    //   user: "6542b6a9cd1b77e631389710",
    //   isActive: true,
    //   isCompleted: false,
    // });

    /*
    //names
    for (const element of payments) {
      //  console.log(element.name.toString())
      let text = `
    
     {
  "_id": {
    "$oid": "${element.name.toString()}"
  },
  "category": {
    "$oid": "67632631d2feadbe97bba884"
  },
  "defaultTasks": [],
 "user": {
    "$oid": "6542b6a9cd1b77e631389710"
  }
}
      `;

      console.log(text);
    }*/

    // for (const element of payments) {
    //   for (const el of element.tasks) {
    //     console.log(el.code.toString());
    //   }
    // }

    //console.log(payments)

    /*
    //maxi

    const paymentsAllMaxi = await Payment.find({
      user: "6542b6a9cd1b77e631389710",
    });
   // console.log(paymentsAllMaxi.length);
    for (const el1 of paymentsAllMaxi) {
      //console.log(el1.name._id.toString());
    }

    const paymentsUndoneMaxi = await Payment.find({
      user: "6542b6a9cd1b77e631389710",
      isActive: true,
      isCompleted: false,
    });
    console.log(paymentsUndoneMaxi.length);
    for (const el2 of paymentsUndoneMaxi) {
      console.log(el2.name._id.toString());
    }*/

    /*
      const paymentsDani = await Payment.find({
      user: "67223988e2af2a24a8db82d3",
    });
    //  console.log(paymentsDani);
    // console.log(paymentsDani.length);

    for (const element of paymentsDani) {
      let name = element.name._id.toString();
     // console.log(name);

      let namesdani = [
        "6722a1b1b96da358b02ce1e7",
        "67228a1541eed8736d1d3648",
        "6722947ba92004e565649852",
        "6722915fa92004e56564981e",
        "672291507d0db26f76895966",
        "6722940cbce7495b534138fd",
        "67229751f6668a02697bab04",
        "67229df4eb44b9ec24a45da9",
        "67229e1eeb44b9ec24a45db1",
        "67229e4ab96da358b02ce1c3",
        "67229e60eb44b9ec24a45dba",
        "67229ecab96da358b02ce1cc",
        "6722a009a14621a7d1c78e3b",
        "6722a020eb44b9ec24a45dc5",
        "6722a033a14621a7d1c78e44",
        "6722a365eb44b9ec24a45df3",
        "6722deff96d842e76b0c3a1f",
        "6761bf19b72e9035cb8bf4b8",
        "6761c0e9c480714ba0c4a2c3",
        "6761c1f9c480714ba0c4a2df",
        "6761c508d300b7b97aed0f15",
        "6761c7e8f1d282576a022c63",
        "6761f7a29de845f0c18c4867",
        "6761d6d5cce21c935a050a56",
        "6761d6f2b920ee40d1546d7f",
        "6761dabd747aaaac4061b3c5",
      ];

      for (let index = 16; index < namesdani.length; index++) {
        //const element = array[index];
        let format = `
    {
      "_id": {
          "$oid": "${namesdani[index]}"
           },
     "name": "nombre ${index + 1}",
     "category": {
               "$oid": "6763640a291e67a7c154340b" 
             },
    "isActive": true,
    "defaultTasks": [],  
"user": {
    "$oid": "67223988e2af2a24a8db82d3" 
  }  
}
    `;

        console.log(format);
      }

      for (const el2 of element.tasks) {
        let task = el2.code._id.toString();
        // console.log(task);
      }
    }

    const taskcodes = [
      "6722891b41eed8736d1d363b",
      "67229397bce7495b534138ef",
      "67229724142f9dabaeb6be52",
      "6722a110eb44b9ec24a45dde",
      "6626c59ddb4828b66d9ac7e6",
      "6762326da7aa0d8e5a14e668",
    ];

    for (let index = 0; index < taskcodes.length; index++) {
      //  const element = array[index];
      let number = 1;

      let format = `
    {
      "_id": {
          "$oid": "${taskcodes[index]}"
           },
     "number": ${number + 1},
     "name": "tarea ${index + 1}",
     "abbr": "tarea ${index + 1}", 
    "allowedUsers": [
             {
               "$oid": "67223988e2af2a24a8db82d3" 
             }
              ],
      "isActive": true,
"user": {
    "$oid": "67223988e2af2a24a8db82d3" 
  }

  
}
    `;

      // console.log(format);

      number++;
    }*/

    const payments = await Payment.find({
      user: "6542b6a9cd1b77e631389710",
    });

    //console.log(payments.length);
    let finalPayments = [];

    for (const element of payments) {
      if (element.isActive && !element.isCompleted) {
      } else {
        finalPayments.push(element);
      }
    }

    console.log(finalPayments.length);

    res.json({ message: "OK" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateDB,
};
