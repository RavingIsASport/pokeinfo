let searchValue = document.getElementById("myForm");

searchValue.addEventListener("submit", (e) => {
  e.preventDefault();
  // console.log(searchValue.elements[0].value);
  let nameValue = searchValue.elements[0].value;
  window.location.href = `/${nameValue}`;
});

// Enhanced Pokemon Features
document.addEventListener("DOMContentLoaded", function () {
  // Image switching functionality
  const normalBtn = document.getElementById("normalBtn");
  const shinyBtn = document.getElementById("shinyBtn");
  const pokeImg = document.getElementById("pokeImg");

  if (normalBtn && shinyBtn && pokeImg) {
    normalBtn.addEventListener("click", function () {
      const defaultSrc = pokeImg.getAttribute("data-default");
      pokeImg.src = defaultSrc;
      normalBtn.classList.add("active");
      shinyBtn.classList.remove("active");

      // Add animation
      pokeImg.style.transform = "scale(0.8)";
      setTimeout(() => {
        pokeImg.style.transform = "scale(1)";
      }, 150);
    });

    shinyBtn.addEventListener("click", function () {
      const shinySrc = pokeImg.getAttribute("data-shiny");
      if (shinySrc && shinySrc !== "null") {
        pokeImg.src = shinySrc;
        shinyBtn.classList.add("active");
        normalBtn.classList.remove("active");

        // Add sparkle animation
        pokeImg.style.transform = "scale(0.8)";
        pokeImg.style.filter = "brightness(1.3)";
        setTimeout(() => {
          pokeImg.style.transform = "scale(1)";
          pokeImg.style.filter = "brightness(1)";
        }, 150);
      } else {
        // Show feedback if no shiny available
        shinyBtn.style.background = "#ff6b6b";
        shinyBtn.textContent = "No Shiny";
        setTimeout(() => {
          shinyBtn.style.background = "";
          shinyBtn.textContent = "Shiny";
        }, 1000);
      }
    });
  }

  // Animate stat bars on page load
  const statFills = document.querySelectorAll(".stat-fill");
  if (statFills.length > 0) {
    setTimeout(() => {
      statFills.forEach((fill) => {
        const width = fill.style.width;
        fill.style.width = "0%";
        setTimeout(() => {
          fill.style.width = width;
        }, 200);
      });
    }, 500);
  }

  // Add hover effects to type badges
  const typeBadges = document.querySelectorAll(".type-badge");
  typeBadges.forEach((badge) => {
    badge.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.05)";
      this.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.3)";
    });

    badge.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
      this.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
    });
  });

  // Add pulse effect to pokemon image
  const pokeImage = document.getElementById("pokeImg");
  if (pokeImage) {
    pokeImage.addEventListener("click", function () {
      this.style.animation = "pulse 0.6s ease-in-out";
      setTimeout(() => {
        this.style.animation = "";
      }, 600);
    });
  }

  // Evolution navigation functionality
  const evolutionPokemon = document.querySelectorAll(".evolution-pokemon");
  evolutionPokemon.forEach((pokemon) => {
    pokemon.addEventListener("click", function () {
      const pokemonName =
        this.querySelector(".evolution-name").textContent.trim();
      if (pokemonName && !this.classList.contains("current-pokemon")) {
        window.location.href = `/${pokemonName}`;
      }
    });

    // Add hover effect
    pokemon.addEventListener("mouseenter", function () {
      if (!this.classList.contains("current-pokemon")) {
        this.style.background =
          "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)";
        this.style.borderColor = "#2196f3";
      }
    });

    pokemon.addEventListener("mouseleave", function () {
      if (!this.classList.contains("current-pokemon")) {
        this.style.background = "white";
        this.style.borderColor = "";
      }
    });
  });
});

// Add CSS animations via JavaScript
const style = document.createElement("style");
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  .stat-fill {
    animation: none;
  }
  
  .type-badge {
    transition: all .03s ease;
  }
`;
document.head.appendChild(style);
