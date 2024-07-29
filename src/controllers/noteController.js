const { default: mongoose } = require("mongoose");
const { Note } = require("../model/Note");

/**
 * Create a new note
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addNote = async (req, res) => {
  try {
   
    res.status(201).json({});
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

    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addNote,
  getAllNotes,
};
