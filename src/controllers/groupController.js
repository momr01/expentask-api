const { default: mongoose } = require("mongoose");
const { Group } = require("../model/Group");
const { Name } = require("../model/NamePayment");

/**
 * Create a new group
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addGroup = async (req, res) => {
  try {
    //1. getting data from body
    const { name, paymentNames } = req.body;

    //2. checking if group already exists
    const groupExists = await Group.findOne({
      name: name,
      user: req.user,
      isActive: true,
    });
    if (groupExists) {
      return res
        .status(409)
        .json({ message: "A group with same name already exists." });
    }

    if (!name) {
      return res
        .status(400)
        .json({ message: "Please verify the required data." });
    }

    //3. checking if paymentNames is empty
    if (!paymentNames || paymentNames.length < 1) {
      return res
        .status(400)
        .json({ message: "There is a problem with the names." });
    }

    //4. checking if every name inside paymentNames is unique
    let unique = [...new Set(paymentNames)];
    if (unique.length != paymentNames.length) {
      return res
        .status(400)
        .json({ message: "You can not duplicate the names." });
    }

    //5. checking if every name inside paymentNames already exists
    for (const name of paymentNames) {
      const nameExists = await Name.findOne({
        _id: name,
        user: req.user,
        isActive: true,
      });
      if (!nameExists) {
        return res
          .status(400)
          .json({ message: "There is a problem with the payment names." });
      }
    }

    //6. creating the new group
    let newGroup = new Group({
      name,
      paymentNames,
      user: req.user,
    });

    //7. saving the new group
    newGroup = await newGroup.save();

    //8. response
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all the groups
 * @param {*} req
 * @param {*} res
 */
const getActiveGroups = async (req, res) => {
  try {
    //1. getting data from db
    const groups = await Group.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user),
          isActive: true,
        },
      },
      {
        $unset: ["__v"],
      },
      {
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
      },
    ]);

    res.status(200).json(groups);
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
const editGroup = async (req, res) => {
  try {
    //1. getting data from body and params
    const { name, paymentNames } = req.body;
    const { id } = req.params;

    //2. checking if the group exists
    let groupExists = await Group.findOne({
      _id: id,
      user: req.user,
      isActive: true,
    });
    if (!groupExists) {
      return res.status(400).json({ message: "The group does not exist." });
    }

    //3. checking if paymentNames is empty
    if (!paymentNames || paymentNames.length < 1) {
      return res
        .status(400)
        .json({ message: "There is a problem with the names." });
    }

    //4. checking if every name inside paymentNames is unique
    let unique = [...new Set(paymentNames)];
    if (unique.length != paymentNames.length) {
      return res
        .status(400)
        .json({ message: "You can not duplicate the names." });
    }

    //5. checking if every name inside paymentNames already exists
    for (const name of paymentNames) {
      const nameExists = await Name.findOne({
        _id: name,
        user: req.user,
        isActive: true,
      });
      if (!nameExists) {
        return res
          .status(400)
          .json({ message: "There is a problem with the payment names." });
      }
    }

    //6. update the group
    groupExists.name = name;
    groupExists.paymentNames = paymentNames;

    //7. saving the updated data of the group
    await groupExists.save();

    res.status(200).json({ message: "Group updated successfully." });
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
const disableGroup = async (req, res) => {
  try {
    // 1. getting data from params
    const { id } = req.params;

    //2. checking the user permission and the state of the group
    let groupActive = await Group.findOne({
      _id: id,
      user: req.user,
      isActive: true,
    });
    if (!groupActive) {
      return res.status(400).json({ message: "The group does not exist." });
    }

    //3. change the state of the group
    groupActive.isActive = false;

    //4. saving the data
    await groupActive.save();

    res.status(204).json({ message: "The group was disabled correctly." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addGroup,
  getActiveGroups,
  editGroup,
  disableGroup,
};
