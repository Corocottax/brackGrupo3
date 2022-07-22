const User = require("./user.model");
const bcrypt = require("bcrypt");
const { setError } = require("../../utils/error/error");
const { generateSign } = require("../../utils/jwt/jwt.js");

const postNewUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    const userDuplicate = await User.findOne({ userName: newUser.userName });
    if (userDuplicate) {
      return next(setError(404, "Usuario existente"));
    }
    if (newUser.rol === "user") {
      const userDB = await newUser.save();
      return res.status(201).json(userDB);
    } else {
      return next(setError(404, "No te puedes registrar a no ser que tengas rol = user"));
    }
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const userDB = await User.findOne({ email: req.body.email });
    if (!userDB) {
      return next(setError(404, "Nombre de usuario incorrecto"));
    }
    if (bcrypt.compareSync(req.body.password, userDB.password)) {
      const token = generateSign(userDB._id, userDB.userName);
      return res.status(200).json({token, userDB});
    } else {
      return next(setError(403, "Contraseña incorrecta"));
    }
  } catch (error) {
    error.message = "error Login";
    return next(error);
  }
};

const logoutUser = (req, res, next) => {
  try {
    const token = null;
    return res.status(200).json(token);
  } catch (error) {
    return next(error);
  }
};

const patchUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patchUser = new User(req.body);
    patchUser._id = id;
    const UserDB = await User.findByIdAndUpdate(id, patchUser);
    if (!UserDB) {
      return next(setError(404, "User not found"));
    }
    return res.status(200).json({ new: patchUser, old: UserDB });
  } catch (error) {
    return next(setError(500, "User cant be replaced"));
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDB = await User.findById(id);
    if (!userDB) {
      return next(setError(404, "User not found"));
    }
    return res.status(200).json(userDB);
  } catch (error) {
    return next(setError(404, "User server fail"));
  }
};


const getUsers = async (req, res, next) => {
  try {
    const userDB = await User.find();
    return res.status(200).json(userDB);
  } catch (error) {
    return next(setError(404, "User server fail"));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDB = await User.findByIdAndRemove(id);
    if (!userDB) {
      return next(setError(404, "Error deleting user"));
    }
    return res.status(200).json(userDB);
  } catch (error) {
    return next(setError(500, "User cant be removed"));
  }
};

module.exports = {
  postNewUser,
  loginUser,
  logoutUser,
  patchUser,
  getUser,
  deleteUser,
  getUsers
};
