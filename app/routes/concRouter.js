const express = require("express");
const ConcController = require("../controllers/concController.js");

const Router = express.Router();

Router.get("/get", ConcController.getConcepts);

module.exports = Router;
