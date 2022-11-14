const express = require("express");
const OpController = require("../controllers/opController.js");

const Router = express.Router();

Router.get("/get_all", OpController.getUserOperations);
Router.get("/get_last", OpController.getLastTenUserOperations);

Router.post("/new", OpController.newOperation);

Router.patch("/cancel/:opId", OpController.cancelOperation);
Router.patch("/restore/:opId", OpController.restoreOperation);
Router.patch("/update", OpController.updateOperation);

module.exports = Router;
