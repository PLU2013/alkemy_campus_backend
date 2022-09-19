const express = require("express");
const OpController = require("../controllers/opController.js");

const Router = express.Router();

Router.get(
  "/get_user_all_operations/:userId",
  OpController.getUserTransactions
);
Router.get(
  "/get_user_last_operations/:userId",
  OpController.getLastTenUserTransactions
);

module.exports = Router;
