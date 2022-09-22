const express = require("express");
const OpController = require("../controllers/opController.js");

const Router = express.Router();

Router.get("/get_all", OpController.getUserOperations);
Router.get("/get_last", OpController.getLastTenUserOperations);

Router.put("/new", OpController.putOperation);

Router.post("/cancel", OpController.cancelOperation);

module.exports = Router;
