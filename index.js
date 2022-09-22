const cfg = require("./app/config/config.js");
const db = require("./app/services/repo/database");
const App = require("./app/app");

const httpServer = App.listen(cfg.PORT, function (error) {
  if (error) return console.log(error + "ERROR en HTTP Server");
  console.log(`Servidor corriendo en el Puerto: ${cfg.PORT}`);
});
