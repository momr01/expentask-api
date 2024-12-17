const { User } = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TaskCode } = require("../model/TaskCode");

//SIGN UP
const signUp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "The passwords have to match!" });
    }

    const hashPassword = await bcrypt.hash(password, 8);

    let user = new User({
      name,
      email,
      password: hashPassword,
    });
    user = await user.save();

    let defaultTaskCode = await TaskCode.findById("6626c59ddb4828b66d9ac7e6");
    if (defaultTaskCode) {
      defaultTaskCode.allowedUsers.push(user.id);
    }

    await defaultTaskCode.save();

    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//SIGN IN
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password!" });
    }

    const token = jwt.sign({ id: existingUser._id }, "passwordKey");
    res.status(200).json({ token, ...existingUser._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//token is valid
const tokenIsValid = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//get user data
const getUserData = async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
};

//module.exports = authRouter;
module.exports = { signIn, signUp, tokenIsValid, getUserData };

// const handleLogin = async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password)
//     return res
//       .status(400)
//       .json({ message: "Username and password are required." });

//   const foundUser = await User.findOne({ username }).exec();
//   if (!foundUser) return res.sendStatus(401); //Unauthorized
//   // evaluate password
//   const match = await bcrypt.compare(password, foundUser.password);
//   if (match) {
//     const idRole = Object.values(foundUser.idRole).filter(Boolean);
//     // create JWTs
//     const accessToken = jwt.sign(
//       {
//         UserInfo: {
//           username: foundUser.username,
//           idRole: idRole,
//         },
//       },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: "10h" } //the first access token will last
//     );
//     const refreshToken = jwt.sign(
//       { username: foundUser.username },
//       process.env.REFRESH_TOKEN_SECRET,
//       { expiresIn: "5h" } //with this even with persistant, data dont refresh
//       //the refresh token will last 5h, so you have 5h to refresh the token once and over, then it won't be possible
//     );
//     // Saving refreshToken with current user
//     foundUser.refreshToken = refreshToken;
//     const result = await foundUser.save();
//     console.log(result);
//     //console.log(role);

//     // Creates Secure Cookie with refresh token
//     res.cookie("jwt", refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "None",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     // Send authorization roles and access token to user
//     res.json({
//       _id: foundUser._id,
//       firstName: foundUser.firstName,
//       lastName: foundUser.lastName,
//       email: foundUser.email,
//       idRole: foundUser.idRole,
//       accessToken,
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };

// module.exports = { handleLogin };
