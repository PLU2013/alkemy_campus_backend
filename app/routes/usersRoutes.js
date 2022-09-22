const express = require("express");
const UsersController = require("../controllers/usersController.js");
const { refreshTokenService, rejectTokenService } = require("../sec");

const Router = express.Router();

Router.post("/", UsersController.getUserLogin);

Router.put("/new", UsersController.newUser);

Router.post("/cancel/:userId", UsersController.cancelUser);
Router.post("/restore/:userId", UsersController.restoreUser);

Router.post("/token/refresh", refreshTokenService);
Router.post("/token/reject", rejectTokenService);

module.exports = Router;
