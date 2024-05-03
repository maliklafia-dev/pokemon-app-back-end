const { Pokemon } = require("../db/sequelize");

module.exports = (app) => {
  app.get("/api/pokemons/:id", (req, res) => {
    Pokemon.findByPk(req.params.id)
      .then((pokemon) => {
        if (pokemon === null) {
          const message = `Le pokemon demandé n'existe pas. Réessayer un autre identifiant.`;
          return res.status(404).json({ message });
        }
        const message = `Le pokemon ${pokemon.name} a bien été récupéré.`;
        res.json({ message, data: pokemon });
      })
      .catch((error) => {
        const message = `Le pokémon n'a pas pu être récupéré. Réessayez dans quelques instants.`;
        res.status(500).json({ message, data: error });
      });
  });
};
