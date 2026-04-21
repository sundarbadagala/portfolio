const User = require("../models/user");
const {
  tokenGenerator,
  hashPassword,
  comparePassword
} = require("../utils/methods");

/**
 * @desc register user
 * @path POST /api/v1/user/register
 * @access public
 */
async function registerUser(req, res, next) {
  try {
    const { email, username, password, confirmpassword } = req.body;
    if (!username || !email || !password || !confirmpassword) {
      res.status(400);
      throw new Error("Insufficient details");
    }
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      res.status(400);
      throw new Error("User already exists");
    }
    if (password !== confirmpassword) {
      res.status(400);
      throw new Error("Password Does not match");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: false
    });
    await newUser.save();
    return res.status(201).json({
      status: "success",
      message: "",
      data: "user created successfully"
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc login user
 * @path POST /api/v1/user/login
 * @access public
 */
async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("user not found");
    }
    if (user && !(await comparePassword(password, user.password))) {
      res.status(400);
      throw new Error("password does not match");
    }
    const payload = {
      user: {
        id: user.id
      }
    };
    tokenGenerator(payload, (err, token) => {
      if (err) throw err;
      return res.status(200).json({
        status: "success",
        message: "",
        data: {
          token: token,
          email: user.email,
          username: user.username
        }
      });
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc get user details
 * @path GET /api/v1/user/details
 * @access private
 */
async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id, "username email _id");
    if (!user) {
      res.status(400);
      throw new Error("Something went wrong");
    }
    res.status(200).json({
      status: "success",
      message: "",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc update user details i.e password username
 * @path PUT /api/v1/user/details
 * @access private
 */
async function updateUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(400);
      throw new Error("Something went wrong");
    }
    const { username, password, confirmpassword } = req.body;
    if (username || (password && confirmpassword)) {
      if (password !== confirmpassword) {
        res.status(400);
        throw new Error("Password does't match");
      }
      if (password && (await comparePassword(password, user.password))) {
        res.status(400);
        throw new Error("Same password");
      }
      const hashedPassword = await hashPassword(password || user.password);
      user.username = username || user.username;
      user.password = hashedPassword;
      await user.save();
      res.status(201).json({
        status: "success",
        message: "",
        data: "Details updated successfully"
      });
    }
    res.status(400);
    throw new Error("Insufficient details");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser
};
