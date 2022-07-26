// WORKS!!

const UserRoutes = require('express').Router();
const { postNewUser, loginUser, logoutUser, getUser, patchUser, deleteUser, getUsers } = require('./user.controller');
const { isUser, isAdmin, isRegistered } = require("../../middlewares/auth");

UserRoutes.post('/', postNewUser);
UserRoutes.post('/login', loginUser);
UserRoutes.post('/logout', logoutUser);
UserRoutes.get('/', getUsers);
UserRoutes.get('/:id', [isRegistered], getUser);
UserRoutes.patch('/:id', [isRegistered], patchUser);
UserRoutes.delete('/:id', [isAdmin], deleteUser);

module.exports = UserRoutes;