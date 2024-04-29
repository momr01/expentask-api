const { USER_ID } = require("../helpers.index");
const bcrypt = require("bcrypt");

//const hashPassword = await bcrypt.hash(password, 8);

const initialUsers = [
  {
    name: "usuario prueba 1",
    email: "usuario@prueba.com",
    password: "$2b$10$9U5udX1tcSYHc3IEg0AGEeY36YcGu1D53s1pAHeiVvmfjcIQV9Hiu"
  },
];

module.exports = {
    initialUsers,
};
