const express = require("express");
const UsersController = require("../controllers/usersController.js");
const {
  validateToken,
  refreshTokenService,
  rejectTokenService,
} = require("../sec");

const Router = express.Router();

Router.post("/login", UsersController.getUserLogin);

Router.post("/new", UsersController.newUser);

Router.use(validateToken);

Router.delete("/delete", UsersController.delete);

Router.patch("/change_pass", UsersController.changePass);

Router.patch("/cancel/:userId", UsersController.cancelUser);
Router.patch("/restore/:userId", UsersController.restoreUser);

Router.post("/token/refresh", refreshTokenService);
Router.post("/token/reject", rejectTokenService);

module.exports = Router;
