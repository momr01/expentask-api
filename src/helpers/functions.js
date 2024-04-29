const { default: mongoose } = require("mongoose");

//const idsAreIncorrect = async (array) => {
  const idsAreIncorrect = async (array) => {
  const errors = [];

  for (const id of array) {
    if (typeof id == "number") {
      errors.push("id can not be a number");
    } else {
      try {
        new mongoose.Types.ObjectId(id);
      } catch (error) {
        errors.push(error);
      }
    }
  }
  return errors;
};

// const checkingIdFormat = async (prevId) => {
//   let id;
//   let errors = [];

//   if (typeof prevId == "number") {
//     errors.push("id can not be a number");
//   } else {
//     try {
//       id = new mongoose.Types.ObjectId(prevId);
//     } catch (error) {
//       errors.push(error);
//     }
//   }

//   return { id, errors };
// };

module.exports = {
  idsAreIncorrect,
  //checkingIdFormat,
};
