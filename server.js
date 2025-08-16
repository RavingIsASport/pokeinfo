// dependencies
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({
  helpers: {
    calc: function (value, max) {
      return Math.round((value / max) * 100);
    },
    eq: function (a, b) {
      return a === b;
    },
  },
});

// express app
const port = 3000;
const app = express();

// handlebars
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Helper function to parse evolution chain
function parseEvolutionChain(chain) {
  const evolutions = [];

  function addEvolution(evolutionData, stage = 1) {
    evolutions.push({
      name: evolutionData.species.name,
      stage: stage,
      id: evolutionData.species.url.split("/")[6], // Extract ID from URL
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        evolutionData.species.url.split("/")[6]
      }.png`,
    });

    // Process next evolutions
    if (evolutionData.evolves_to && evolutionData.evolves_to.length > 0) {
      evolutionData.evolves_to.forEach((evolution) => {
        addEvolution(evolution, stage + 1);
      });
    }
  }

  addEvolution(chain);
  return evolutions;
}

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

    // Fetch evolution data
    let pokeEvolutions = [];
    try {
      // Get species data first
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();

      // Get evolution chain
      if (speciesData.evolution_chain?.url) {
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();

        // Parse evolution chain
        pokeEvolutions = parseEvolutionChain(evolutionData.chain);
      }
    } catch (evolutionError) {
      console.log("Evolution data not available:", evolutionError.message);
    }

    // Convert measurements
    const pokeHeight = data.height * 10; // decimeters to cm
    const pokeWeight = (data.weight / 10).toFixed(1); // hectograms to kg

    // Format types
    const pokeTypes = data.types.map((typeInfo) => ({
      name: typeInfo.type.name,
      slot: typeInfo.slot,
    }));

    // Format stats
    const pokeStats = data.stats.map((statInfo) => ({
      name: statInfo.stat.name.replace("-", " "),
      value: statInfo.base_stat,
      maxValue: 200, // For progress bar calculation
    }));

    // Format abilities
    const pokeAbilities = data.abilities.map((abilityInfo) => ({
      name: abilityInfo.ability.name.replace("-", " "),
      isHidden: abilityInfo.is_hidden,
    }));

    // Get additional sprites
    const pokeSprites = {
      default: data.sprites.front_default,
      shiny: data.sprites.front_shiny,
      official: data.sprites.other["official-artwork"]?.front_default,
      back: data.sprites.back_default,
    };

    // Format moves - get the most recent version moves
    const pokeMoves = data.moves
      .filter((moveData) => {
        // Get the most recent version group details
        const recentVersions = moveData.version_group_details.filter((detail) =>
          ["sword-shield", "scarlet-violet", "sun-moon", "x-y"].includes(
            detail.version_group.name
          )
        );
        return recentVersions.length > 0;
      })
      .map((moveData) => {
        const recentVersions = moveData.version_group_details.filter((detail) =>
          ["sword-shield", "scarlet-violet", "sun-moon", "x-y"].includes(
            detail.version_group.name
          )
        );
        const latestVersion = recentVersions[0];

        return {
          name: moveData.move.name.replace(/-/g, " "),
          level: latestVersion.level_learned_at || 0,
          learnMethod: latestVersion.move_learn_method.name,
          url: moveData.move.url,
        };
      })
      .sort((a, b) => {
        // Sort by learn method priority, then by level
        const methodPriority = { "level-up": 1, machine: 2, tutor: 3, egg: 4 };
        const aPriority = methodPriority[a.learnMethod] || 5;
        const bPriority = methodPriority[b.learnMethod] || 5;

        if (aPriority !== bPriority) return aPriority - bPriority;
        return a.level - b.level;
      })
      .slice(0, 12); // Limit to 12 most relevant moves

    res.render("pokemon", {
      pokemon: data,
      pokeH: pokeHeight,
      pokeW: pokeWeight,
      pokeId: String(data.id).padStart(3, "0"), // Format as #001, #025, etc.
      pokeTypes: pokeTypes,
      pokeStats: pokeStats,
      pokeAbilities: pokeAbilities,
      pokeSprites: pokeSprites,
      pokeExperience: data.base_experience,
      pokeMoves: pokeMoves,
      pokeEvolutions: pokeEvolutions,
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
