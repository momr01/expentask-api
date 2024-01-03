const { default: mongoose } = require("mongoose");
const Payment = require("../model/Payment");
const Name = require("../model/NamePayment");
const User = require("../model/User");
const { checkingArrayIds, checkingIdFormat } = require("../helpers/functions");
const USER_ID = "6542b6a9cd1b77e631389710";

const getPayment = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Please check the required data." });
  }

  const idFormat = await checkingIdFormat(req.params.id);
  if (idFormat.errors.length > 0)
    return res.status(400).json({ message: "The id format is not correct." });

  try {
    const result = await Payment.findById(req.params.id).exec();
    return res.json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There ir an error. Please try again later." });
  }
};

//create a new payment
const addPayment = async (req, res) => {
  // 1. Verifico que los campos obligatorios del formulario traigan información
  if (
    !req?.body?.payments ||
    !req?.body?.month ||
    !req?.body?.year ||
    req?.body?.payments?.length == 0
  ) {
    return res.status(400).json({ message: "Please verify the required data" });
  }

  // 2. Verifico formato del ID del usuario
  const idFormat = await checkingIdFormat(USER_ID);
  if (idFormat.errors.length > 0) {
    return res.status(400).json({ message: "The user Id is not correct." });
  }

  // 3. Verifico formato del ID de cada nombre de pago
  const idNamesFormat = await checkingArrayIds(req.body.payments);
  if (idNamesFormat.length > 0) {
    return res.status(400).json({
      message:
        "There is a problem with names ids. Please check and try again later.",
    });
  }

  // 4. Verifico si el usuario existe
  const userExists = await checkingUser(idFormat.id);
  if (userExists.length > 0) {
    return res
      .status(400)
      .json({ message: "It is not possible to detect the current user." });
  }

  // 5. Verifico si existen los nombres
  for (const name of req.body.payments) {
    try {
      const nameExists = await Name.findById(name).exec();
      if (nameExists == null || !nameExists.isActive) {
        return res
          .status(404)
          .json({ message: "Please check the array of names." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error. Please try again!" });
    }
  }

  // 6. Verifico que no exista otro pago activo y sin completar, con mismo nombre
  for (const name of req.body.payments) {
    try {
      const payments = await Payment.aggregate([
        {
          $match: {
            isCompleted: false,
            isActive: true,
            name: new mongoose.Types.ObjectId(name),
          },
        },
      ]).exec();

      if (payments.length > 0) {
        return res
          .status(409)
          .json({ message: "There is already a payment with the name." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error. Please try again!" });
    }
  }

  // 7. Defino valor de fecha de vencimiento que se cargará en la base de datos
  let date = new Date(req.body.year, req.body.month, 0);

  // 8. Guardo los pagos en la base de datos
  const result = await paymentsAdding(req.body.payments, date, idFormat.id);
  if (result.length > 0)
    return res.status(500).json({ message: "Error. Please try again!" });
  else
    return res.status(201).json({ message: "Payment created successfully." });
};

const checkingUser = async (id) => {
  let errors = [];

  try {
    const result = await User.findById(id).exec();
    if (!result.isActive) errors.push("User is not active.");
  } catch (error) {
    errors.push(error);
  }
  return errors;
};

const paymentsAdding = async (array, date, idUser) => {
  const errors = [];

  for (const nameId of array) {
    try {
      await Payment.create({
        name: nameId,
        deadline: date,
        user: idUser,
        tasks: [
          {
            code: 1,
            name: "Pagar",
            deadline: date,
          },
          {
            code: 2,
            name: "Imprimir factura",
            deadline: date,
          },
          {
            code: 3,
            name: "Imprimir comprobante de pago",
            deadline: date,
          },
          {
            code: 4,
            name: "Enviar email",
            deadline: date,
            isActive: false,
          },
        ],
      });
    } catch (error) {
      errors.push(error);
    }
  }
  return errors;
};

//get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate({
      path: "name",
    });
    if (payments.length < 1)
      return res.status(204).json({ message: "No payments found" });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all active and non-completed payments with active and non-completed tasks
const getUndonePayments = async (req, res) => {
  try {
    const payments = await Payment.aggregate([
      {
        $match: {
          isCompleted: false,
          isActive: true,
        },
      },
      {
        $addFields: {
          amount: {
            $toString: "$amount",
          },
        },
      },
      {
        $unset: ["isActive", "dataEntry", "__v"],
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
    ]).exec();
    if (payments.length < 1)
      return res.status(204).json({ message: "No payments found" });

    let filterPayments = [];
    for (const payment of payments) {
      filterPayments.push({
        _id: payment._id,
        name: payment.name,
        deadline: payment.deadline,
        amount: payment.amount,
        tasks: payment.tasks,
        isCompleted: payment.isCompleted,
        user: payment.user,
      });
    }
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//edit the payment information
const editPayment = async (req, res) => {
  if (
    !req?.params?.id ||
    !req?.body?.name ||
    !req?.body?.deadline ||
    !req?.body?.amount ||
    !req?.body?.tasks ||
    req?.body?.tasks.length != 4
  )
    return res
      .status(400)
      .json({ message: "Please check the required data. 1" });

  const checkDataFromBodyTasks = await checkingTasksData(req.body.tasks);
  if (checkDataFromBodyTasks.length > 0)
    return res
      .status(400)
      .json({ message: "Please check the required data. 2" });

  const idsFormat = await checkingArrayIds([req.params.id, req.body.name]);
  if (idsFormat.length > 0)
    return res.status(400).json({
      message:
        "The id payment format and/or the id name format are not correct.",
    });

  const nameExists = await Name.findById(req.body.name).exec();
  if (nameExists.length < 1) {
    return res.status(404).json({ message: "The name does not exist." });
  }

  try {
    const paymentExists = await Payment.findById(req.params.id);
    if (
      paymentExists.length < 1 ||
      !paymentExists?.isActive ||
      paymentExists?.isCompleted
    )
      return res
        .status(403)
        .json({ message: "The payment doesn't exist or is not active." });

    for (const taskP of paymentExists.tasks) {
      for (const taskB of req.body.tasks) {
        if (taskP.code == taskB.code) {
          taskP.isActive = taskB.isActive;
          taskP.deadline = taskB.deadline;
        }
      }
    }

    await paymentExists.save();

    await Payment.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        deadline: req.body.deadline,
        amount: req.body.amount,
      }
    ).exec();

    return res.status(200).json({ message: "Payment updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const checkingTasksData = async (array) => {
  let numberOfTasks = 0;
  let errors = [];

  for (const task of array) {
    numberOfTasks++;
    if (!task.code || task.isActive == null || !task.deadline)
      errors.push("Faltan atributos");
  }

  if (numberOfTasks != 4) errors.push("Error");

  return errors;
};

//complete one activity inside one payment
const completeTask = async (req, res) => {
  if (!req?.params?.id || !req?.body?.codeTask) {
    return res.status(400).json({ message: "Please check the required data." });
  }

  const idFormat = await checkingIdFormat(req.params.id);
  if (idFormat.errors.length > 0)
    return res.status(400).json({ message: "The payment id is not correct." });

  if (req.body.codeTask == 1 && !req?.body?.method)
    return res.status(400).json({ message: "Please check the required data." });

  try {
    const paymentExists = await Payment.findById(req.params.id);

    if (
      paymentExists.length < 1 ||
      paymentExists.isCompleted ||
      !paymentExists.isActive
    )
      return res.status(400).json({
        message:
          "The payment doesn't exist or is not active. Please try again!",
      });

    let taskCompletedOrInactive = [];

    for (const task of paymentExists.tasks) {
      if (task.code == req.body.codeTask) {
        if (!task.isCompleted && task.isActive) {
          console.log(task);
          task.place = req?.body?.method ? req.body.method : "";
          task.isCompleted = true;
          task.dateCompleted = req?.body?.date ? req.body.date : new Date();
        } else {
          taskCompletedOrInactive.push(task);
        }
      }
    }

    if (taskCompletedOrInactive.length > 0)
      return res
        .status(400)
        .json({ message: "The task is already completed or inactive." });

    await paymentExists.save();

    const checkPaymentActiveStatus = await getNumberOfActiveTasks(
      paymentExists.tasks
    );

    const checkPaymentCompletedStatus = await getNumberOfCompletedTasks(
      paymentExists.tasks
    );

    if (checkPaymentActiveStatus == checkPaymentCompletedStatus)
      paymentExists.isCompleted = true;

    await paymentExists.save();

    return res.status(201).json({ message: "Task completed." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error happened. Please try again later!." });
  }
};

const getNumberOfActiveTasks = async (array) => {
  let activeTotal = 0;
  for (const task of array) {
    if (task.isActive == true) activeTotal++;
  }

  return activeTotal;
};

const getNumberOfCompletedTasks = async (array) => {
  let completedTotal = 0;
  for (const task of array) {
    if (task.isCompleted == true) completedTotal++;
  }

  return completedTotal;
};

//delete one payment or disable
const disablePayment = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Please check the required data." });
  }

  const idFormat = await checkingIdFormat(req.params.id);
  if (idFormat.errors.length > 0)
    return res.status(400).json({ message: "The id is not correct." });

  const paymentActive = await Payment.findById(req.params.id).exec();

  if (paymentActive.length < 1) {
    return res.status(404).json({ message: "The payment does not exist." });
  }

  if (!paymentActive.isActive) {
    return res
      .status(403)
      .json({ message: "The payment is already inactive." });
  }

  try {
    await Payment.findByIdAndUpdate(req.params.id, {
      isActive: false,
    }).exec();

    return res
      .status(200)
      .json({ message: "The payment was disabled correctly." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error happened. Please try again later!." });
  }
};

const createAlerts = async (req, res) => {
  try {
    const payments = await Payment.aggregate([
      {
        $match: {
          isCompleted: false,
          isActive: true,
        },
      },
      {
        $addFields: {
          tasks: {
            $filter: {
              input: "$tasks",
              as: "i",
              cond: {
                $eq: ["$$i.isActive", true],
              },
            },
          },
        },
      },
      {
        $unset: ["isActive", "dataEntry", "__v"],
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
          ],
        },
      },
    ]).exec();
    if (payments.length < 1)
      return res.status(204).json({ message: "No payments found" });

    let filterPayments = [];
    for (const payment of payments) {
      for (let i = 0; i < payment.tasks.length; i++) {
        const day = getDaysBetweenDates(payment.tasks[i].deadline);

        if (day >= -5 && !payment.tasks[i].isCompleted) {
          filterPayments.push({
            paymentId: payment._id,
            paymentName: payment.name[0].name,
            taskId: payment.tasks[i]._id,
            taskCode: payment.tasks[i].code,
            taskName: payment.tasks[i].name,
            taskDeadline: payment.tasks[i].deadline,
            taskIsActive: payment.tasks[i].isActive,
            taskIsCompleted: payment.tasks[i].isCompleted,
            daysNumber: day,
          });
        }
      }
    }
    res.json(filterPayments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDaysBetweenDates = (dateFromDB) => {
  let dateNow = new Date();

  dateNow.setHours(0, 0, 0, 0);

  let Difference_In_Time = dateNow.getTime() - dateFromDB.getTime();

  // To calculate the no. of days between two dates
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
  return Difference_In_Days;
};

module.exports = {
  addPayment,
  getAllPayments,
  completeTask,
  getUndonePayments,
  disablePayment,
  editPayment,
  getPayment,
  createAlerts,
};
