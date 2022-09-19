const db = require("./app/services/repo/database.js");
const CONFIG = require("./app/config/config.js");
const App = require("./app/app.js");
// const jwt = require("jsonwebtoken");
//const dotenv = require("dotenv").config();

const httpServer = App.listen(CONFIG.PORT, function (error) {
  if (error) return console.log(error + "ERROR EN ESCUCHA DE PUERTO ");
  console.log(`Servidor corriendo en el Puerto: ${CONFIG.PORT}`);
});

App.get("/", (req, res) => {
  res.send("<h1>Alkemy Campus Challenge</h1>");
});
