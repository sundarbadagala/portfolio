const User = require("../models/user");
const {
  tokenGenerator,
  hashPassword,
  comparePassword
} = require("../utils/methods");
const { RegisterUserDto, LoginUserDto, UpdateUserDto } = require("../dto/user.dto");

/**
 * @desc register user
 * @path POST /api/v1/user/register
 * @access public
 */
async function registerUser(req, res, next) {
  try {
    const dto = new RegisterUserDto(req.body);
    dto.validate();
    const { email, username, password } = dto;
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      res.status(400);
      throw new Error("User already exists");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: false
    });
    await newUser.save();
    return res.sendSuccess("user created successfully", "", 201);
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
    const dto = new LoginUserDto(req.body);
    dto.validate();
    const { email, password } = dto;
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
      return res.sendSuccess({ token, email: user.email, username: user.username });
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
    return res.sendSuccess(user);
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
    const dto = new UpdateUserDto(req.body);
    dto.validate();
    const { username, password } = dto;
    if (password && (await comparePassword(password, user.password))) {
      res.status(400);
      throw new Error("Same password");
    }
    const hashedPassword = await hashPassword(password || user.password);
    user.username = username || user.username;
    user.password = hashedPassword;
    await user.save();
    return res.sendSuccess("Details updated successfully", "", 201);
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
