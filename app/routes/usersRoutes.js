const express = require("express");
const UsersController = require("../controllers/usersController.js");

const Router = express.Router();

Router.get("/login", UsersController.getUserLogin);

Router.put("/new", UsersController.newUser);

Router.post("/cancel/:userId", UsersController.cancelUser);
Router.post("/restore/:userId", UsersController.restoreUser);

module.exports = Router;
