const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const App = express();

const Users = require("./routes/usersRoutes");
const Ops = require("./routes/opRoutes");

App.use(cors());
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));

App.use("/api/users", Users);
App.use("/api/ops", Ops);

module.exports = App;
