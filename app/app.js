const express = require("express");
const { validateToken } = require("./sec");
const bodyParser = require("body-parser");
var cors = require("cors");
const App = express();

const Users = require("./routes/usersRoutes");
const Ops = require("./routes/opRoutes");

App.use(cors());
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));

App.use("/api/login", Users);
App.use("/api/users", validateToken, Users);
App.use("/api/ops", validateToken, Ops);
App.use("*", (req, res) => res.status(403).json({ message: "403 Forbiden" }));

App.get("/", (req, res) => {
  res.send("<h1>Alkemy Campus Challenge</h1>");
});

module.exports = App;
