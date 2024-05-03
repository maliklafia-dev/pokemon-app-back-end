const { Pokemon } = require("../db/sequelize");

module.exports = (app) => {
  app.put("/api/pokemons/:id", (req, res) => {
    const id = req.params.id;
    Pokemon.update(req.body, {
      //effectuer la modification dans la bd avec l'id correspondant
      where: { id: id },
    }).then((_) => {
      return Pokemon.findByPk(id)
        .then((pokemon) => {
          if (pokemon === null) {
            //si l'id n'existe pas
            const message = `Le pokemon demandé n'existe pas. Réessayer un autre identifiant.`;
            return res.status(404).json({ message });
          } //si c'est le bon, renvoyer le résultat en json et persister dans la bd
          const message = `Le pokémon ${pokemon.name} a bien été modifié.`;
          res.json({ message, data: pokemon });
        }) //si on arrive pas à se connecter à la bd
        .catch((error) => {
          const message = `Le pokémon n'a pas pu être modifié. Réessayez dans quelques instants.`;
          res.status(500).json({ message, data: error });
        });
    });
  });
};
