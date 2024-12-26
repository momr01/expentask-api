const { default: mongoose } = require("mongoose");
const { Category } = require("../model/Category");

/**
 * Create a new category
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addCategory = async (req, res) => {
  try {
    //1. getting data from body
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "The name is required." });
    }

    //2. checking if the category already exists
    const categoryExists = await Category.findOne({
      name: name,
      user: req.user,
    });
    if (categoryExists) {
      return res.status(409).json({ message: "The category already exists." });
    }

    //3. creating new category
    let newCategory = new Category({
      name: name,
      user: req.user,
    });
    newCategory = newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all the categories
 * @param {*} req
 * @param {*} res
 */
const getAllCategories = async (req, res) => {
  try {
    //1. getting data from db
    /* let categories = await Category.find({ user: req.user });

    for (let category of categories) {
      // console.log(category);

      let names = await Name.find({ category, user: req.user, isActive: true });

      for (const name of names) {
        category.listNames.push(name);
      }
    }

    //console.log(categories);*/

    /* let categories = await Category.aggregate([
      {
        $match: {
          isActive: true,
          user: new mongoose.Types.ObjectId(req.user),
        },
      },
     /* {
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
      },*/
    //]);

    let categories = await Category.aggregate([
      {
        $match: {
          isActive: true,
          user: new mongoose.Types.ObjectId(req.user),
        },
      },
      {
        $lookup: {
          from: "names", // Colección secundaria
          localField: "_id", // Campo en Category
          foreignField: "category", // Campo en Name que corresponde
          as: "listNames", // Nombre del campo virtual agregado
          pipeline: [
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
        $addFields: {
          listNames: {
            $filter: {
              input: "$listNames",
              as: "name",
              cond: { $eq: ["$$name.isActive", true] }, // Solo nombres activos
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          isActive: 1,
          listNames: 1, // Solo los campos necesarios
        },
      },
      {
        $sort: {
          name: 1, // Orden ascendente por name
         //period: 1, // Orden ascendente por period
        },
      },
    ]
    , {collation: {
      locale: "pt"
   }}
  );

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Edit a category
 * @param {*} req
 * @param {*} res
 * @returns
 */
const editCategory = async (req, res) => {
  try {
    //1. getting data from body and params
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(400).json({ message: "The name is required." });
    }

    //2. checking if the category exists
    let categoryExists = await Category.findById(id);
    if (!categoryExists) {
      return res.status(400).json({ message: "The category doesn't exist." });
    }

    //3. checking if the name is already in use
    const nameExists = await Category.findOne({
      name: name,
      user: req.user,
      isActive: true,
    });
    if (nameExists) {
      return res.status(409).json({ message: "The name is already in use." });
    }

    //4. update name
    categoryExists.name = name;
    await categoryExists.save();

    res.status(200).json({ message: "Category updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Disable one category
 * @param {*} req
 * @param {*} res
 * @returns
 */
const disableCategory = async (req, res) => {
  try {
    // 1. getting data from params
    const { id } = req.params;

    //2. checking the user permission and the state of the category
    let categoryActive = await Category.findOne({
      _id: id,
      user: req.user,
      isActive: true,
    });
    if (!categoryActive) {
      return res.status(400).json({ message: "The category does not exist." });
    }

    //3. change the state of the payment
    categoryActive.isActive = false;

    //4. saving the data
    await categoryActive.save();

    res.status(204).json({ message: "The category was disabled correctly." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCategories,
  addCategory,
  editCategory,
  disableCategory,
};
