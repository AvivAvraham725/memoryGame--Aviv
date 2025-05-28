// 1. Empty Cards will show on opening page
function initBoard() {
  const board = document.querySelector(".memory-game");
  board.innerHTML = "";

  for (let i = 0; i < 12; i++) {
    const card = document.createElement("div");
    card.classList.add("memory-card");

    card.innerHTML = `
      <img class="front-face" src="" alt="front" />
      <img class="back-face" src="un.png" alt="back" />
    `;

    board.appendChild(card);
  }
}

document.addEventListener("DOMContentLoaded", initBoard);

// 2. Create a api for each category
const apiUrls = {
  HarryPotter: 'https://hp-api.onrender.com/api/characters',
  Flags: 'https://restcountries.com/v3.1/all',
  Pokemon: 'https://pokeapi.co/api/v2/generation/1',
};

function getApiByCategory(category) {
  return apiUrls[category];
}

// 3. When we choose a category, Create  a messege that the game will start (let's play (category) memoryGame).
function clickOnCategory(category) {
  alert(`Let's play ${category} memoryGame`);
  document.getElementById("welcomeMessage").textContent = " ";
  startCategoryGame(category);
}

// 4. Take data from api and create the basic logic(shuffle, take random items, create the cards from the api data)
function startCategoryGame(category) {
  const apiUrl = getApiByCategory(category);
  const board = document.querySelector(".memory-game");
  board.innerHTML = "";

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      let items = [];

if (category === "HarryPotter") {
  const filtered = data.filter(item => item.image); // סינון דמויות בלי תמונה
  items = getRandomItems(filtered, 6).map(item => ({
    name: item.name,
    image: item.image
  }));
} else if (category === "Flags") {
  const randomCountries = getRandomItems(data, 6);
  items = randomCountries.map(country => ({
    name: country.name.common,
    image: country.flags.svg
  }));
} else if (category === "Pokemon") {
  const allPokemons = getRandomItems(data.pokemon_species, 6);
  items = allPokemons.map(poke => ({
    name: poke.name,
    image: `https://img.pokemondb.net/sprites/home/normal/${poke.name}.png`
  }));
}

      const cards = shuffle([...items, ...items]);

      cards.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("memory-card");
        card.setAttribute("data-name", item.name);

        const frontContent = item.image.includes("http")
          ? `<img src="${item.image}" alt="${item.name}" />`
          : item.image;

        card.innerHTML = `
          <div class="front-face">${frontContent}</div>
          <img class="back-face" src="un.png" alt="back" />
        `;

        board.appendChild(card);
      });

      addFlipCardLogic();
    })
    .catch(err => {
      console.error("Error fetching data:", err);
    });
}

function getRandomItems(arr, count) {
  return arr.sort(() => 0.5 - Math.random()).slice(0, count);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// 5. Create a game logic (flip the cards, match the cards, disable the cards that are matched)
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;

function addFlipCardLogic() {
  const cards = document.querySelectorAll('.memory-card');

  cards.forEach(card => {
    card.addEventListener('click', handleFlip);
  });
}

function handleFlip() {
  if (lockBoard || this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', handleFlip);
  secondCard.removeEventListener('click', handleFlip);
  resetBoard();

// 6. When the game is over, create a messege that the game is over (well done).//
// ------------------------------------------------------------------
  matchedPairs++;
  if (matchedPairs === 6) {
    alert('Well done! Press the reset button to play again.');
  }
  // -----------------------------------------------------------------
}
// continue section 5
function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// 7. Create a reset button that will reset the game and all the cards.
function resetGame() {
  matchedPairs = 0;
  initBoard();
  document.getElementById("welcomeMessage").textContent = "Please choose a category to start the game ";  
}


