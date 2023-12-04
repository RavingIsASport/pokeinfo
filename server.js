// dependencies
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({});

// express app
const port = 3000;
const app = express();

// handlebars
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});
// get pokemon
app.get("/:name", async (req, res) => {
  //test params
  console.log(req.params.name);
  const { name } = req.params;
  //   fetch pokemon
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    );
    const data = await response.json();
    const pokeHeight = data.height * 10;
    const pokeWeight = data.weight % 1000;
    console.log(data.abilities[0].ability.name);
    res.render("pokemon", {
      pokemon: data,
      pokeH: pokeHeight,
      pokeW: pokeWeight,
    });
  } catch (error) {
    console.error(error);
    res.render("nopokemon");
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

module.exports = app;
