const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const { success } = require("./helper");
const { getUniqueId } = require("./helper");
let pokemons = require("./mock-pokemon");
const pokemonModel = require("./src/models/pokemon");
//Connection à la bd
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = 3000;

//Configuration de la bd
const sequelize = new Sequelize("pokedex", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  dialectOptions: {
    timezone: "Etc/GMT-2",
  },
  loggin: false,
});

sequelize
  .authenticate()
  .then((_) =>
    console.log("La connexion à la base de données a bien été établie.")
  )
  .catch((error) =>
    console.error(`Impossible de se conecter à la base de données ${error}`)
  );

//synchronisation à la bd
const Pokemon = pokemonModel(sequelize, DataTypes);

sequelize.sync({ force: true }).then((_) => {
  console.log('La base de données "Pokedex a bien été synchronisée"');
  pokemons.map((pokemon) => {
    Pokemon.create({
      name: pokemon.name,
      hp: pokemon.hp,
      cp: pokemon.cp,
      picture: pokemon.picture,
      types: pokemon.types.join(),
    }).then((bulbizarre) => console.log(bulbizarre.toJSON()));
  });
});

//middlewares
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

//end Points
app.get("/", (req, res) => res.send("Hello, Express 2 again !"));

app.get("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = pokemons.find((pokemon) => pokemon.id === id);
  const message = "Un pokemon a été trouvé.";
  res.json(success(message, pokemon));
});

app.get("/api/pokemons", (req, res) => {
  const message = " La liste des pokémons a bien été récupérée.";
  res.json(success(message, pokemons));
});

app.post("/api/pokemons", (req, res) => {
  const id = getUniqueId(pokemons);
  const pokemonCreated = { ...req.body, ...{ id: id, created: new Date() } };
  pokemons.push(pokemonCreated);
  const message = `Le pokemon ${pokemonCreated.name} a bien été crée.`;
  res.json(success(message, pokemonCreated));
});

app.put("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonUpdated = { ...req.body, id: id };
  pokemons = pokemons.map((pokemon) => {
    return pokemon.id === id ? pokemonUpdated : pokemon;
  });

  const message = `Le pokemon ${pokemonUpdated.name} a bien été modifié.`;
  res.json(success(message, pokemonUpdated));
});

app.delete("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonDeleted = pokemons.find((pokemon) => pokemon.id === id);
  pokemons = pokemons.filter((pokemon) => pokemon.id !== id);
  const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`;
  res.json(success(message, pokemonDeleted));
});

app.listen(port, () =>
  console.log(
    `Notre application Node est démarré sur : http://localhost:${port}`
  )
);
