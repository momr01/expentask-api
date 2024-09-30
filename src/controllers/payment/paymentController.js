const { default: mongoose } = require("mongoose");
const Payment = require("../../model/Payment");
const { Name } = require("../../model/NamePayment");
const User = require("../../model/User");
const { idsAreIncorrect } = require("../../helpers/functions");
const { TaskCode } = require("../../model/TaskCode");
const {
  getNumberOfTasks,
  getNumberOfCompletedTasks,
  getDaysBetweenDates,
} = require("./helpers");
const USER_ID = "6542b6a9cd1b77e631389710";

/**
 * Get one project by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getPayment = async (req, res) => {
  try {
    //1. getting the id of the payment from the params
    const { id } = req.params;

    //2. bringing the result with all the information
    const result = await Payment.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          user: new mongoose.Types.ObjectId(req.user),
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
              $unset: ["password","isActive", "dataEntry", "payments", "__v"],
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
            $first: "$dataEntry"
          }
        },
      },
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create many payments in one operation
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addIndividualPayments = async (req, res) => {
  try {
    //1. getting variables from body
    const { names, month, year } = req.body;

    //2. checking if every name is different
    let namesUnique = [...new Set(names)];
    if (namesUnique.length != names.length) {
      return res
        .status(400)
        .json({ message: "You can not duplicate the names." });
    }

    //3. creating variables to save in db
    let defineDeadline = new Date(year, month, 0);
    let period;
    if (month >= 1 && month <= 9) {
      period = `0${month}-${year}`;
    } else {
      period = `${month}-${year}`;
    }

    // just validations
    for (const name of names) {
      //4. checking if every name exists
      const nameExists = await Name.findOne({
        _id: name,
        user: req.user,
      });
      if (!nameExists)
        return res.status(400).json({ message: "The names don't exist." });

      //5. checking there is no payment with same period already created
      let samePeriodExists = await Payment.findOne({
        name: name,
        period: period,
        user: req.user,
        //isActive: true
      });
      if (samePeriodExists && samePeriodExists.isActive) {
        return res.status(409).json({
          message:
            "You have at least one payment with same name and period already registered.",
        });
      }
    }

    // creation
    for (const name of names) {
      //previous information
      const nameExists = await Name.findOne({
        _id: name,
        user: req.user,
      });

      let samePeriodExists = await Payment.findOne({
        name: name,
        period: period,
        user: req.user,
        //isActive: true
      });

      //6. updating payment with same period but isActive = false
      if (samePeriodExists && !samePeriodExists.isActive) {
        samePeriodExists.isActive = true;
        samePeriodExists.save();
      } else {
        //7. creating the payments
        let newPayment = new Payment({
          name: name,
          deadline: defineDeadline,
          user: req.user,
          period: period,
        });

        if (nameExists.defaultTasks.length > 0) {
          for (const task of nameExists.defaultTasks) {
            const taskSchema = {
              code: task,
              deadline: defineDeadline,
              paymentId: newPayment._id,
            };
            newPayment.tasks.push(taskSchema);
          }
        } else {
          const firstCode = await TaskCode.findOne({
            number: 1,
            user: req.user,
          });

          if(firstCode){
            const taskSchema = {
              code: firstCode._id,
              deadline: defineDeadline,
              paymentId: newPayment._id,
            };
            newPayment.tasks.push(taskSchema);
          } else {
            return res.status(400).json({
              message:
                "Please add at least one task code before creating a new payment.",
            });
          }
         
        }
        newPayment.save();
      }
    }

    res.json({ result: "Payments created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all the payments
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllPayments = async (req, res) => {
  try {
    //1. bringing the result
    const payments = await Payment.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user),
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
              $unset: ["password","isActive", "dataEntry", "payments", "__v"],
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
            $first: "$dataEntry"
          }
        },
      },
    ]);

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all active and non-completed payments with active and non-completed tasks
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getUndonePayments = async (req, res) => {
  try {
    //1. getting the results
    const payments = await Payment.aggregate([
      {
        $match: {
          isCompleted: false,
          isActive: true,
          user: new mongoose.Types.ObjectId(req.user),
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
              $unset: ["password","isActive", "dataEntry", "payments", "__v"],
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
          tasks: { $push: "$tasks" },
          amount: {
            $first: "$amount",
          },
          isActive: {
            $first: "$isActive",
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
          // dateCompleted: {
          //   $first: "$dateCompleted",
          // },
          dataEntry: {
            $first: "$dataEntry"
          }
        },
      },
    ]);

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Edit the payment information
 * @param {} req
 * @param {*} res
 * @returns
 */
const editPayment = async (req, res) => {
  try {
    //1. getting data from body and params
    const { name, deadline, amount, tasks } = req.body;
    const { id } = req.params;

    // 2. checking if payment name exists
    const nameExists = await Name.findOne({ _id: name, user: req.user });
    if (!nameExists) {
      return res.status(400).json({ message: "The name does not exist." });
    }

    // 3. checking if payment overall exists - actived and not completed and the user permissions
    let paymentExists = await Payment.findOne({
      _id: id,
      isActive: true,
      isCompleted: false,
      user: req.user,
    });
    if (!paymentExists)
      return res
        .status(400)
        .json({ message: "The payment doesn't exist or is not active." });

    // 4. saving code ids from body into one array
    let codesArray = [];
    for (let task of tasks) {
      codesArray.push(task.code);
    }
    // 5. updating codesArray array without repetitions
    let uniq = [...new Set(codesArray)];
    if (uniq.length != codesArray.length) {
      return res
        .status(400)
        .json({ message: "You can not duplicate the task code." });
    }

    // 6. check if each code id from the body exists
    for (let id of codesArray) {
      const codeExists = await TaskCode.findOne({ _id: id, user: req.user });
      if (!codeExists) {
        return res.status(400).json({
          message: "The task code is not correct!",
        });
      }
    }

    // 7. definition of arrays to update and create tasks
    let unsavedTasks = [];
    let savedTasks = [];

    // 8. separate from body, tasks already saved from new tasks
    for (let task of tasks) {
      let result = paymentExists.tasks.find((e) => e.code == task.code);
      if (result != null) {
        savedTasks.push(task);
      } else {
        unsavedTasks.push(task);
      }
    }

    // 9. definition of clean array to start with the editing / creation
    let cleanTasksArray = [];

    // 10. asign to cleanTasksArray the tasks that exist in db and also come with the body
    for (let dbTask of paymentExists.tasks) {
      if (uniq.find((e) => e === dbTask.code.toString())) {
        cleanTasksArray.push(dbTask);
      }
    }

    // 11. asign the values to db
    paymentExists.tasks = cleanTasksArray;

    // 12. save into db, new tasks
    for (let index = 0; index < unsavedTasks.length; index++) {
      paymentExists.tasks.push({
        code: unsavedTasks[index].code,
        deadline: unsavedTasks[index].deadline,
        paymentId: paymentExists.id,
      });
    }

    // 13. updated in db, tasks that already exist
    for (let index = 0; index < savedTasks.length; index++) {
      for (var item of paymentExists.tasks) {
        if (item.code == savedTasks[index].code) {
          item.deadline = savedTasks[index].deadline;
        }
      }
    }

    // 14. assignment of other values from the body
    paymentExists.name = name;
    paymentExists.deadline = deadline;
    paymentExists.amount = amount;

    // 15. completed the whole payment if every task is completed
    let numberOfCompletedTasks = 0;
    for (const task of paymentExists.tasks) {
      if (task.isCompleted) {
        numberOfCompletedTasks++;
      }
    }

    if (numberOfCompletedTasks == paymentExists.tasks.length) {
      paymentExists.isCompleted = true;
      paymentExists.dateCompleted = new Date();
    }

    await paymentExists.save();

    res.status(200).json({ message: "Payment updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Complete one activity inside one payment
 * @param {*} req
 * @param {*} res
 * @returns
 */
const completeTask = async (req, res) => {
  try {
    //1. getting data from body and params
    const { taskId, date } = req.body;
    const { id } = req.params;

    //2. find the payment that contains the task and checking the user permission, that the payment is active and is not completed
    let paymentExists = await Payment.findOne({
      _id: id,
      user: req.user,
      isCompleted: false,
      isActive: true,
    });
    if (!paymentExists) {
      return res.status(400).json({
        message:
          "The payment doesn't exist, is not active or you are not allowed to manage it. Please try again!",
      });
    }

    //3. checking the task exists inside the payment
    let taskExists = paymentExists.tasks.find((e) => e._id == taskId);
    if (!taskExists) {
      return res.status(400).json({
        message: "The task doesn't exist or is not active. Please try again!",
      });
    }

    //4. checking the state of the task that we want to complete
    for (let task of paymentExists.tasks) {
      if (task._id == taskId) {
        //we find the task
        if (!task.isCompleted) {
          //the task is not completed
          task.place = req.body.method ? req.body.method : "";
          task.isCompleted = true;
          task.dateCompleted = date;
        } else {
          //the task is completed
          return res
            .status(400)
            .json({ message: "The task is already completed or inactive." });
        }
      }
    }

    //5. checking if the number of completed tasks is the same to the number of tasks overall
    const tasksTotal = await getNumberOfTasks(paymentExists.tasks);
    const tasksCompleted = await getNumberOfCompletedTasks(paymentExists.tasks);
    if (tasksTotal == tasksCompleted) {
      paymentExists.isCompleted = true;
      paymentExists.dateCompleted = new Date();
    }

    //6. saving the data
    await paymentExists.save();

    res.status(201).json({ message: "Task completed." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Disable one payment
 * @param {*} req
 * @param {*} res
 * @returns
 */
const disablePayment = async (req, res) => {
  try {
    // 1. getting data from params
    const { id } = req.params;

    //2. checking the user permission and the state of the payment
    let paymentActive = await Payment.findOne({
      _id: id,
      user: req.user,
      isActive: true,
    });
    if (!paymentActive) {
      return res.status(400).json({ message: "The payment does not exist." });
    }

    //3. change the state of the payment
    paymentActive.isActive = false;

    //4. saving the data
    await paymentActive.save();

    res.status(204).json({ message: "The payment was disabled correctly." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all the alerts and notifications
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createAlerts = async (req, res) => {
  try {
    const payments = await Payment.aggregate([
      {
        $match: {
          isCompleted: false,
          isActive: true,
          user: new mongoose.Types.ObjectId(req.user),
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
        $unset: ["isActive", "__v"],
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
      {
        $unwind: "$tasks",
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
            $first: "$dataEntry"
          }
        },
      },
    ]);

    let filterPayments = [];

    if (payments.length > 0) {
      for (const payment of payments) {
        for (let i = 0; i < payment.tasks.length; i++) {
          const day = getDaysBetweenDates(payment.tasks[i].deadline);

          if (day >= -5 && !payment.tasks[i].isCompleted) {
            filterPayments.push({
              paymentId: payment._id,
              paymentName: payment.name[0].name,
              taskId: payment.tasks[i]._id,
              taskCode: payment.tasks[i].code[0].number.toString(),
              taskName: payment.tasks[i].code[0].name,
              taskDeadline: payment.tasks[i].deadline,
              taskIsActive: payment.tasks[i].isActive,
              taskIsCompleted: payment.tasks[i].isCompleted,
              daysNumber: day,
            });
          }
        }
      }
    }

    res.json(filterPayments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const numberOfAlerts = async (req, res) => {
  try {
    let total = 0;

    const payments = await Payment.find({
      isCompleted: false,
      isActive: true,
      user: new mongoose.Types.ObjectId(req.user),
    });

  
    if (payments.length > 0) {
      for (const payment of payments) {
        for (let i = 0; i < payment.tasks.length; i++) {
          const day = getDaysBetweenDates(payment.tasks[i].deadline);

          if (day >= -5 && !payment.tasks[i].isCompleted && payment.tasks[i].isActive) {
            total++;
          }
        }
      }
    }

    res.json({ alerts: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPayments,
  completeTask,
  getUndonePayments,
  disablePayment,
  editPayment,
  getPayment,
  createAlerts,
  addIndividualPayments,
  numberOfAlerts,
};
