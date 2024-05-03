const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const sequelize = require("./src/db/sequelize");
const findAllPokemons = require("./src/routes/findAllPokemons");
const findPokemonByPk = require("./src/routes/findPokemonByPk");
//const updatePokemon = require("./src/routes/updatePokemon");
//const deletePokemon = require("./src/routes/deletePokemon");

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
require("./src/routes/findAllPokemons")(app); // get sur /api/pokemons
require("./src/routes/findPokemonByPk")(app); // get sur /api/pokeon/:id
require("./src/routes/createPokemon")(app); // post sur /api/pokemons
require("./src/routes/updatePokemon")(app); // put sur /api/pokemons/:id
require("./src/routes/deletePokemon")(app); // delete sur /api/pokemon/:id

app.listen(port, () =>
  console.log(
    `Notre application Node est démarré sur : http://localhost:${port}`
  )
);
