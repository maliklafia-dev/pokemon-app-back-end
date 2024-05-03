const { Pokemon } = require("../db/sequelize");

module.exports = (app) => {
  app.get("/api/pokemons/:id", (req, res) => {
    Pokemon.findByPk(req.params.id).then((pokemon) => {
      const message = `Le pokemon ${pokemon.name} a bien été récupéré.`;
      res.json({ message, data: pokemon });
    });
  });
};
