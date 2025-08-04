const { default: mongoose } = require("mongoose");
const { Note } = require("../model/Note");
const { Name } = require("../model/NamePayment");
const Payment = require("../model/Payment");

/**
 * Create a new note
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addNote = async (req, res) => {
  try {
    //1. getting data from body
    const { title, content } = req.body;

    //2. checking if note already exists
    const noteExists = await Note.findOne({
      title,
      content,
      user: req.user,
      isActive: true,
    });
    if (noteExists) {
      return res
        .status(409)
        .json({ message: "A note with same data already exists." });
    }

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Please verify the required data." });
    }

    //3. creating the new note
    let newNote = new Note({
      title,
      content,
      user: req.user,
    });

    //4. check if payment id or name id is correct

    if (req.body.associatedType) {
      if (req.body.associatedType === "PAGO") {
        const paymentExists = await Payment.findOne({
          _id: req.body.associatedValue,
          user: req.user,
          isActive: true,
        });
        if (!paymentExists) {
          return res
            .status(400)
            .json({ message: "There is a problem with the payment id." });
        } else {
          newNote.associatedType = req.body.associatedType;
          newNote.associatedValue = paymentExists._id;
        }
      } else if (req.body.associatedType === "NOMBRE") {
        const nameExists = await Name.findOne({
          _id: req.body.associatedValue,
          user: req.user,
          isActive: true,
        });
        if (!nameExists) {
          return res
            .status(400)
            .json({ message: "There is a problem with the name id." });
        } else {
          newNote.associatedType = req.body.associatedType;
          newNote.associatedValue = nameExists._id;
        }
      }
    }
    /*
    if (req.body.paymentId) {
      // console.log("hay id pago");
      // console.log(req.body);
      const paymentExists = await Payment.findOne({
        _id: req.body.paymentId,
        user: req.user,
        isActive: true,
      });
      if (!paymentExists) {
        return res
          .status(400)
          .json({ message: "There is a problem with the payment id." });
      } else {
        newNote.paymentAssociated = paymentExists._id;
      }
    }

    if (req.body.nameId) {
      const nameExists = await Name.findOne({
        _id: req.body.nameId,
        user: req.user,
        isActive: true,
      });
      if (!nameExists) {
        return res
          .status(400)
          .json({ message: "There is a problem with the name id." });
      } else {
        newNote.nameAssociated = nameExists._id;
      }
    }*/

    //5. saving the new note
    newNote = await newNote.save();

    //6. response
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all the notes
 * @param {*} req
 * @param {*} res
 */
const getAllNotes = async (req, res) => {
  try {
    //1. getting data from db

    const notes = await Note.aggregate([
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
        $addFields: {
          estado: {
            $cond: {
              if: { $eq: ["$isActive", true] },
              then: "activo",
              else: "inactivo",
            },
          },
        },
      }*/
      /*  {
        $lookup: {
          from: "payments",
          localField: "associatedValue",
          foreignField: "_id",
          as: "pagoData",
        },
      },
      {
        $unwind: {
          path: "$pagoData",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup a colección de nombres

      {
        $lookup: {
          from: "names",
          localField: "associatedValue",
          foreignField: "_id",
          as: "nombreData",
        },
      },
      {
        $unwind: {
          path: "$nombreData",
          preserveNullAndEmptyArrays: true,
        },
      },*/
      // Agregar objeto "pago" o "nombre" condicionalmente
      /* {
        $addFields: {
          pago: {
            $cond: [
              { $eq: ["$associatedType", "PAGO"] },
              {
                // id: "$pagoData._id",
                // nombre: "$pagoData.nombre",
                // periodo: "$pagoData.periodo",
                id: "sdfsfs",
                nombre: "sfsfsfs",
                periodo: "sfsfsf",
              },
              "$$REMOVE", // no agregar si no es PAGO
            ],
          },
          nombre: {
            $cond: [
              { $eq: ["$associatedType", "NOMBRE"] },
              {
                // id: "$nombreData._id",
                // nombre: "$nombreData.name",
                id: "sfsfsd",
                nombre: "afafsaf",
              },
              "$$REMOVE", // no agregar si no es NOMBRE
            ],
          },
        },
      },
      // Opcional: quitar los campos temporales
      {
        $project: {
          pagoData: 0,
          nombreData: 0,
        },
      },*/

      /* {
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

    const enrichedNotes = await Promise.all(
      notes.map(async (note) => {
        if (note.associatedType === "PAGO") {
          const pago = await Payment.findById(note.associatedValue).lean();
          if (pago) {
            const nombre = await Name.findById(pago.name).lean();
            if (nombre) {
              note.payment = {
                id: pago._id,
                name: nombre.name,
                period: pago.period,
              };
            }
          }
        } else if (note.associatedType === "NOMBRE") {
          const nombre = await Name.findById(note.associatedValue).lean();
          if (nombre) {
            note.name = {
              id: nombre._id,
              name: nombre.name,
            };
          }
        }
        return note;
      })
    );

    res.status(200).json(enrichedNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Edit a note
 * @param {*} req
 * @param {*} res
 * @returns
 */
const editNote = async (req, res) => {
  try {
    //1. getting data from body
    const { title, content } = req.body;
    const { id } = req.params;

    //2. checking if note exists
    let noteExists = await Note.findOne({
      _id: id,
      user: req.user,
      isActive: true,
    });
    if (!noteExists) {
      return res.status(409).json({ message: "The note doesn't exist." });
    }

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Please verify the required data." });
    }

    //3. updating the note
    noteExists.title = title;
    noteExists.content = content;
    /*  let newNote = new Note({
      title,
      content,
      user: req.user,
    });*/

    //4. check if payment id or name id is correct

    if (req.body.associatedType) {
      if (req.body.associatedType === "PAGO") {
        const paymentExists = await Payment.findOne({
          _id: req.body.associatedValue,
          user: req.user,
          isActive: true,
        });
        if (!paymentExists) {
          return res
            .status(400)
            .json({ message: "There is a problem with the payment id." });
        } else {
          noteExists.associatedType = req.body.associatedType;
          noteExists.associatedValue = paymentExists._id;
        }
      } else if (req.body.associatedType === "NOMBRE") {
        const nameExists = await Name.findOne({
          _id: req.body.associatedValue,
          user: req.user,
          isActive: true,
        });
        if (!nameExists) {
          return res
            .status(400)
            .json({ message: "There is a problem with the name id." });
        } else {
          noteExists.associatedType = req.body.associatedType;
          noteExists.associatedValue = nameExists._id;
        }
      }
    }
    /*
    if (req.body.paymentId) {
      // console.log("hay id pago");
      // console.log(req.body);
      const paymentExists = await Payment.findOne({
        _id: req.body.paymentId,
        user: req.user,
        isActive: true,
      });
      if (!paymentExists) {
        return res
          .status(400)
          .json({ message: "There is a problem with the payment id." });
      } else {
        newNote.paymentAssociated = paymentExists._id;
      }
    }

    if (req.body.nameId) {
      const nameExists = await Name.findOne({
        _id: req.body.nameId,
        user: req.user,
        isActive: true,
      });
      if (!nameExists) {
        return res
          .status(400)
          .json({ message: "There is a problem with the name id." });
      } else {
        newNote.nameAssociated = nameExists._id;
      }
    }*/

    //5. saving the updating note
    noteExists = await noteExists.save();

    //6. response
    res.status(200).json(noteExists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Disable a note
 * @param {*} req
 * @param {*} res
 * @returns
 */
const disableNote = async (req, res) => {
  try {
    //1. getting data from body
    const { id } = req.params;

    //2. checking if note exists and is Active
    let noteExists = await Note.findOne({
      _id: id,
      user: req.user,
      isActive: true,
    });
    if (!noteExists) {
      return res.status(409).json({ message: "The note doesn't exist." });
    }

    //3. updating the note
    noteExists.isActive = false;

    //4. saving the updating note
    noteExists = await noteExists.save();

    //5. response
    res.status(200).json(noteExists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addNote,
  getAllNotes,
  editNote,
  disableNote,
};
