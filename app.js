const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const sequelize = require("./src/db/sequelize");

//Initialisation du serveur.
const app = express();
const port = 3000;

//middlewares
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev")) //Donne un message  en console sur l'état des requêtes.
  .use(bodyParser.json()); //transform les chaines de caractère en JSON

//Initialisation de la db
sequelize.initDb();

//End Points

app.listen(port, () =>
  console.log(
    `Notre application Node est démarré sur : http://localhost:${port}`
  )
);
