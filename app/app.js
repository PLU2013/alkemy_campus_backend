const express = require("express");
const { validateToken } = require("./sec");
const bodyParser = require("body-parser");
var cors = require("cors");
const App = express();

const Users = require("./routes/usersRoutes");
const Ops = require("./routes/opRoutes");
const Concepts = require("./routes/concRouter");

App.use(cors());
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));

App.get("/", (req, res) => {
  res.send("<h1>Alkemy Campus Challenge</h1>");
});

App.use("/api/users", Users);
App.use("/api/ops", validateToken, Ops);
App.use("/api/concepts", validateToken, Concepts);
App.use("*", (req, res) => res.status(403).json({ message: "403 Forbiden" }));

module.exports = App;
