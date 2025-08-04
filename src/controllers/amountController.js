const { default: mongoose } = require("mongoose");
const { Amount } = require("../model/Amount");
const Payment = require("../model/Payment");

/**
 * Create a new amount detail
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addAmountDetail = async (req, res) => {
  try {
    //1. getting data from body
    const { date, description, amount, paymentId } = req.body;

    //2. checking if detail already exists
    /* const amountExists = await Amount.findOne({
     date,
     description,
     amount,
     payment: paymentId,
      user: req.user,
      isActive: true,
    });
    if (amountExists) {
      return res
        .status(409)
        .json({ message: "An amount detail with same name already exists." });
    }*/

    if (!date || !description || !amount || !paymentId) {
      return res
        .status(400)
        .json({ message: "Please verify the required data." });
    }

    const paymentExists = await Payment.findOne({
      _id: paymentId,
      user: req.user,
      // isActive: true,
    });

    if (!paymentExists) {
      return res.status(409).json({ message: "The payment does not exists." });
    }

    //3. creating the new amount detail
    let newAmount = new Amount({
      date,
      description,
      amount,
      payment: paymentId,
      user: req.user,
    });

    //4. saving the new amount
    newAmount = await newAmount.save();

    //5. response
    res.status(201).json(newAmount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all the amount details
 * @param {*} req
 * @param {*} res
 */
const getAllAmounts = async (req, res) => {
  try {
    //1. getting data from db
    const amounts = await Amount.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user),
          isActive: true,
        },
      },
      {
        $unset: ["__v"],
      },
      /*{
        $unwind: "$paymentNames",
      },
      {
        $lookup: {
          from: "names",
          localField: "paymentNames",
          foreignField: "_id",
          as: "paymentName",
          pipeline: [
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
              },
            },
            {
              $unset: [
                "__v",
                //"defaultTasks", "dataEntry", "user", "category"
              ],
            },
          ],
        },
      },

      {
        $set: {
          paymentNames: { $first: "$paymentName" },
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
          isActive: {
            $first: "$isActive",
          },
          user: {
            $first: "$user",
          },
          paymentNames: { $push: "$paymentNames" },
          dataEntry: {
            $first: "$dataEntry",
          },
        },
      },*/
    ]);

    res.status(200).json(amounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all the amount details of certain payment
 * @param {*} req
 * @param {*} res
 */
const getPaymentAmounts = async (req, res) => {
  try {
    const { id } = req.params;

    //1. getting data from db
    const amounts = await Amount.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user),
          payment: new mongoose.Types.ObjectId(id),
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
        $unset: ["__v"],
      },
    ]);

    res.status(200).json(amounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Edit the group information
 * @param {} req
 * @param {*} res
 * @returns
 */
const editPaymentAmount = async (req, res) => {
  try {
    //1. getting data from body and params
    const { date, description, amount, paymentId } = req.body;
    const { id } = req.params;

    //2. checking if the amount exists
    let amountExists = await Amount.findOne({
      _id: id,
      user: req.user,
      isActive: true,
      payment: paymentId,
    });
    if (!amountExists) {
      return res.status(400).json({ message: "The amount does not exist." });
    }

    //3. checking if the payment already exists
    const paymentExists = await Payment.findOne({
      _id: paymentId,
      user: req.user,
      isActive: true,
    });
    if (!paymentExists) {
      return res
        .status(400)
        .json({ message: "There is a problem with the payment." });
    }

    //4. update the amount
    amountExists.date = date;
    amountExists.description = description;
    amountExists.amount = amount;

    //5. saving the updated data of the amount
    await amountExists.save();

    res.status(200).json({ message: "Amount updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Disable one group
 * @param {*} req
 * @param {*} res
 * @returns
 */
const disablePaymentAmount = async (req, res) => {
  try {
    // 1. getting data from params
    const { id } = req.params;

    //2. checking the user permission and the state of the amount
    let amountActive = await Amount.findOne({
      _id: id,
      user: req.user,
      isActive: true,
    });
    if (!amountActive) {
      return res.status(400).json({ message: "The amount does not exist." });
    }

    //3. change the state of the amount
    amountActive.isActive = false;

    //4. saving the data
    await amountActive.save();

    res.status(204).json({ message: "The amount was disabled correctly." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  /* addGroup,
  getActiveGroups,
  editGroup,
  disableGroup,*/
  addAmountDetail,
  getAllAmounts,
  getPaymentAmounts,
  editPaymentAmount,
  disablePaymentAmount,
};
