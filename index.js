let firstCard,
secondCard,
cards = [],
total = 0,
person = {
  name: document.getElementById("player-name").value,
  chips: 100,
}

let hasBlackjack = false,
isAlive = true,
canRetry = false;

let messageEl = document.getElementById("msg"),
totalEl = document.getElementById("total"),
cardsEl = document.getElementById("cards"),
playerNameEl = document.getElementById("player-name"),
chipsEl = document.getElementById("player-chips"),
errorEl = document.getElementById("error");

let btnRetry = document.createElement("button"),
  btnNewCard = document.createElement("button");

// Button Event Listeners
let btnStart = document.createElement("button"),
btnStartEl= document.getElementById("btn-start");
btnStartEl.addEventListener("click", startGame);

/**
 * Starts the game by initializing the cards and rendering the buttons.
 *
 * @return {undefined} This function does not return a value.
 */
function startGame() {
  firstCard = getRandomCard();
  secondCard = getRandomCard();
  cards = [firstCard, secondCard];

  // Check if the input value is empty or consists of only whitespace
  const inputValue = playerNameEl.value.trim();
  if (inputValue === "") {
    error.textContent = "Player name cannot be empty.";
    return;
  }
  error.textContent = "";

  renderButton(btnRetry, "Retry", "retry", ".btn-wrapper");
  renderButton(btnNewCard, "New Card", "newCard", ".btn-wrapper");

  document.getElementById('btn-retry').addEventListener("click", resetGame);
  document.getElementById('btn-newCard').addEventListener("click", newCard);
  
  document.getElementById('btn-start').remove();

  validateGame();
}

/**
 * Validates the game and updates the game state accordingly.
 *
 * @return {undefined} No return value.
 */
function validateGame() {
  if (person.chips === 0) {
    alert('You are out of chips. Game over!');
    window.location.reload();
  }

  total = getTotal();

  if (hasBlackjack === false && isAlive === true) {
    // Check if game is still valid
    if (total < 21) {
      message = "Do you want to draw a new card?";
    } else if (total === 21) {
      message = "Wohoo! You've got Blackjack!";
      hasBlackjack = true;
      isAlive = false;
      person.chips += 50;

    } else {
      message = "You're out of the game!";
      isAlive = false;
      person.chips -= 10;
    }

    renderText(totalEl, total);
    renderText(messageEl, message);
    renderText(chipsEl, person.chips);
    renderCards(cards);

    console.log('cards:' + cards);
    console.log('total:'+ total);
  } else {
    resetGame();
  }
}

/**
 * Resets the game by resetting all game variables, updating the UI, and reloading the page.
 *
 * @return {void} This function does not return anything.
 */
function resetGame() {
  hasBlackjack = false;
  isAlive = true;
  canRetry = false;
  total = 0;
  cards = [];
  message = "Let's play Blackjack!";
  
  renderCards(cards);
  renderText(totalEl, total);
  renderText(messageEl, message);

  btnRetry.remove();
  btnNewCard.remove();

  let btnStart = document.createElement("button");
  renderButton(btnStart, "Start Game", "start", ".btn-wrapper");
  document.getElementById('btn-start').addEventListener("click", startGame);
}

/**
 * Generates a random card value between 1 and 12.
 *
 * @return {number} The randomly generated card value.
 */
function getRandomCard() {
  let myMin = 1,
  myMax = 12,
  randomNumber = Math.floor(Math.random() * (myMax - myMin + 1)) + myMin;
  if (randomNumber === 1) {
    return 11;
  } else if (randomNumber > 10) {
    return 10;
  }

  return randomNumber;
}

/**
 * Calculates the total sum of all elements in the 'cards' array.
 *
 * @param {Array} cards - The array of numbers to be summed.
 * @return {number} The total sum of all elements in the 'cards' array.
 */
function getTotal () {
  let total = 0;
  cards.forEach(element => {
    total += element;
  });
  return total;
}

/**
 * Sets the text content of the given element to the specified text.
 *
 * @param {Element} element - The element to update.
 * @param {string} text - The text to set as the content of the element.
 * @return {string} The updated text content of the element.
 */
function renderText(element, text) {
  return element.textContent = text;
}

/**
 * Renders the given array of cards to the DOM element with the id 'cards'.
 *
 * @param {Array} cards - The array of cards to be rendered.
 */
function renderCards(cards) {
  cardsEl.textContent = "Cards: ";
  cards.forEach(element => {
    cardsEl.textContent += `[${element}] `;
  });

}

/**
 * Generates a new card and adds it to the cards array.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function newCard() {
  let newCard = getRandomCard();
  cards.push(newCard);
  validateGame();
}

/**
 * Renders a button with the specified title and id, and appends it to the target container.
 *
 * @param {HTMLElement} button - The button element to be rendered.
 * @param {string} title - The title of the button.
 * @param {string} id - The id of the button.
 * @param {string} targetContainer - The selector of the target container element where the button will be appended.
 */
function renderButton(button, title, id, targetContainer) {
  button.textContent = title;
  button.id = "btn-" + id;
  button.classList = "btn-" + id;
  document.querySelector(targetContainer).appendChild(button);
}
