const User = require("../model/User");
const bcrypt = require("bcrypt");

//add new user
const addUser = async (req, res) => {
  if (!req?.body?.password || !req?.body?.email) {
    return res.status(400).json({ message: "Please verify the required data" });
  }

  const duplicateEmail = await User.findOne({ email: req.body.email }).exec();
  if (duplicateEmail) return res.sendStatus(409); //Conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(req.body.password, 10);

    const result = await User.create({
      password: hashedPwd,
      email: req.body.email,
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get all users
// const getAllUsers = async (req, res) => {
//   const users = await User.find();
//   if (!users) return res.status(204).json({ message: "No users found" });
//   res.json(users);
// };

//add new user
// const addUser = async (req, res) => {
//   if (
//     !req?.body?.firstName ||
//     !req?.body?.lastName ||
//     !req?.body?.username ||
//     !req?.body?.password ||
//     !req?.body?.email ||
//     !req?.body?.idRole
//   ) {
//     return res.status(400).json({ message: "Please verify the required data" });
//   }

//   const duplicateUsername = await User.findOne({
//     username: req.body.username,
//   }).exec();
//   if (duplicateUsername) return res.sendStatus(409); //Conflict

//   const duplicateEmail = await User.findOne({ email: req.body.email }).exec();
//   if (duplicateEmail) return res.sendStatus(409); //Conflict

//   try {
//     //encrypt the password
//     const hashedPwd = await bcrypt.hash(req.body.password, 10);

//     const result = await User.create({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       username: req.body.username,
//       password: hashedPwd,
//       email: req.body.email,
//       idRole: req.body.idRole,
//     });
//     res.status(201).json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

//update the user information
// const updateUser = async (req, res) => {
//   if (!req?.params?.id) {
//     return res.status(400).json({ message: "ID parameter is required." });
//   }

//   const user = await User.findOne({ _id: req.params.id }).exec();
//   if (!user) {
//     return res
//       .status(204)
//       .json({ message: `No user matches ID ${req.params.id}.` });
//   }
//   if (req.body?.firstName) user.firstName = req.body.firstName;
//   if (req.body?.lastName) user.lastName = req.body.lastName;
//   if (req.body?.email) user.email = req.body.email;
//   if (req.body?.urlPhoto) user.urlPhoto = req.body.urlPhoto;
//   const result = await user.save();
//   res.json(result);
// };

//disable an user - it will appear as inactive
// const disableUser = async (req, res) => {
//   if (!req?.params?.id) {
//     return res.status(400).json({ message: "ID parameter is required." });
//   }

//   const user = await User.findOne({ _id: req.params.id }).exec();
//   if (!user) {
//     return res
//       .status(204)
//       .json({ message: `No user matches ID ${req.params.id}.` });
//   }

//   if (!user.isActive) {
//     return res.status(400).json({ message: "The user is already inactive" });
//   }
//   user.isActive = false;
//   const result = await user.save();
//   res.json(result);
// };

//enable an user - it will appear as active
// const enableUser = async (req, res) => {
//   if (!req?.params?.id) {
//     return res.status(400).json({ message: "ID parameter is required." });
//   }

//   const user = await User.findOne({ _id: req.params.id }).exec();
//   if (!user) {
//     return res
//       .status(204)
//       .json({ message: `No user matches ID ${req.params.id}.` });
//   }

//   if (user.isActive) {
//     return res.status(400).json({ message: "The user is already active" });
//   }
//   user.isActive = true;
//   const result = await user.save();
//   res.json(result);
// };

//change the current password of an user
// const changePwd = async (req, res) => {
//   if (!req?.params?.id) {
//     return res.status(400).json({ message: "ID parameter is required." });
//   }

//   const user = await User.findOne({ _id: req.params.id }).exec();
//   if (!user) {
//     return res
//       .status(204)
//       .json({ message: `No user matches ID ${req.params.id}.` });
//   }

//   if (
//     !req?.body?.currentPassword ||
//     !req?.body?.newPassword ||
//     !req?.body?.confirmPassword
//   ) {
//     return res.status(400).json({ message: "Please verify the required data" });
//   }

//   const match = await bcrypt.compare(req?.body?.currentPassword, user.password);
//   if (!match) {
//     return res.sendStatus(401);
//   }

//   if (req?.body?.newPassword !== req?.body?.confirmPassword) {
//     return res.status(400).json({ message: "Please verify the data" });
//   }

//   try {
//     const hashedPwd = await bcrypt.hash(req.body.newPassword, 10);

//     user.password = hashedPwd;
//     const result = await user.save();
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getUser = async (req, res) => {
//     if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
//     const user = await User.findOne({ _id: req.params.id }).exec();
//     if (!user) {
//         return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
//     }
//     res.json(user);
// }

module.exports = {
  // getAllUsers,
  addUser,
  // updateUser,
  // disableUser,
  // enableUser,
  // changePwd,
  //getUser
};
