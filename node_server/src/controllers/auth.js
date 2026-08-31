const Auth = require("../models/auth");
const {
  tokenGenerator,
  hashPassword,
  comparePassword
} = require("../utils/methods");
const { RegisterUserDto, LoginUserDto } = require("../dto/user.dto");

const COOKIE_NAME = "token";

// Helper to set auth cookie
function setAuthCookie(req, res, token) {
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction || req.secure || req.headers["x-forwarded-proto"] === "https",
    sameSite: "strict",
    maxAge: 36000000 // 10 hours matching expiresIn in methods.js (36000000 ms)
  });
}

/**
 * @desc register user and set auth cookie
 * @path POST /api/v1/auth/register
 * @access public
 */
async function registerUser(req, res, next) {
  try {
    const dto = new RegisterUserDto(req.body);
    dto.validate();
    const { email, username, password } = dto;
    const isEmailExist = await Auth.findOne({ email });
    if (isEmailExist) {
      res.status(400);
      throw new Error("User already exists");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new Auth({
      username,
      email,
      password: hashedPassword,
      isAdmin: false,
      isUser: true
    });
    await newUser.save();
    
    // Generate token and set cookie
    const payload = {
      user: {
        id: newUser.id
      }
    };
    
    tokenGenerator(payload, (err, token) => {
      if (err) return next(err);
      setAuthCookie(req, res, token);
      return res.sendSuccess(
        { email: newUser.email, username: newUser.username },
        "User registered and authenticated successfully",
        201
      );
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc login user and set auth cookie
 * @path POST /api/v1/auth/login
 * @access public
 */
async function loginUser(req, res, next) {
  try {
    const dto = new LoginUserDto(req.body);
    dto.validate();
    const { email, password } = dto;
    const user = await Auth.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    if (user && !(await comparePassword(password, user.password))) {
      res.status(400);
      throw new Error("Password does not match");
    }
    const payload = {
      user: {
        id: user.id
      }
    };
    tokenGenerator(payload, (err, token) => {
      if (err) return next(err);
      setAuthCookie(req, res, token);
      return res.sendSuccess(
        { email: user.email, username: user.username },
        "Logged in successfully"
      );
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc logout user and clear cookie
 * @path POST /api/v1/auth/logout
 * @access public
 */
async function logoutUser(req, res, next) {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: isProduction || req.secure || req.headers["x-forwarded-proto"] === "https",
      sameSite: "strict"
    });
    return res.sendSuccess(null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * @desc get current authenticated user details
 * @path GET /api/v1/auth/me
 * @access private
 */
async function getMe(req, res, next) {
  try {
    const user = await Auth.findById(req.user.id, "username email _id isAdmin isUser role createdAt");
    if (!user) {
      const isProduction = process.env.NODE_ENV === "production";
      res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: isProduction || req.secure || req.headers["x-forwarded-proto"] === "https",
        sameSite: "strict"
      });
      res.status(401);
      throw new Error("User not found");
    }
    return res.sendSuccess(user, "User details fetched successfully");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe
};
