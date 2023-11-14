const initialChips = 100;

// create users instances
let dealer = new User('Dealer', 100),
player = new User('Player', 100);

// set game stauses
let gameInProgress = false,
hasBlackJack = false;

// reference elements and store to variables
let playerCardsEl = document.getElementById('player-cards'),
    dealerCardsEl = document.getElementById('dealer-cards'),
    playerTotalEl = document.getElementById('player-total'),
    dealerTotalEl = document.getElementById('dealer-total'),
    playerChipsEl = document.getElementById('player-chips');

let betAmount = 0;

// Create button objects
const btn_object_start = new Buttons("btn-start", "Start Game", "button-wrapper", () => {
  renderGame(false);
}),
btn_object_stand = new Buttons("btn-stand", "Stand", "button-wrapper", () => {
  standCards();
}),
btn_object_hit = new Buttons("btn-hit", "Hit", "button-wrapper", () => {
  hitCards(true);
}),
btn_object_retry = new Buttons("btn-retry", "Retry", "button-wrapper", () => {
  resetGame();
}),
btn_object_bet = new Buttons("btn-bet", "Place a Bet", "button-wrapper", () => {
  placeBet();
});

// render place bet button
btn_object_bet.render();

/**
 * Creates a User object with the given name.
 *
 * @param {string} name - The name of the user.
 * @return {undefined} 
 */
function User(name) {
  this.name = name;
  this.chips = initialChips;
  this.cards = [];
  // create method
  this.sumOfCards = function() {
    if (this.cards.length > 0) {
      return this.cards.reduce((accumulator, curr_value) => accumulator + curr_value, 0);
    }
  }
}

/**
 * Creates a Buttons object that represents a button with a specified id, title, target container,
 * and callback function. The render function adds the button to the target container and sets up a
 * click event listener to invoke the callback function.
 *
 * @param {string} id - The id of the button.
 * @param {string} title - The title or text content of the button.
 * @param {string} targetContainer - The id of the HTML element where the button will be appended.
 * @param {function} callback - The function to be invoked when the button is clicked.
 */
function Buttons(id, title, targetContainer, callback) {
  this.id = id;
  this.title = title;
  this.targetContainer = targetContainer;
  this.callback = callback;

  this.render = function() {
    // Create a button element
    const button = document.createElement("button");

    // Set attributes and text content
    button.id = this.id;
    button.textContent = this.title;

    // Add click event listener to invoke the callback function
    button.addEventListener("click", () => {
      if (typeof this.callback === 'function') {
        this.callback();
      }
    });

    // Append the button to the target container
    const container = document.getElementById(this.targetContainer);
    if (container) {
      container.appendChild(button);
    } else {
      console.error("Target container not found.");
      return;
    }
  };
}

/**
 * Executes the placeBet function.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function placeBet() {
    showCustomPrompt(); 
}

/**
 * Renders the game by initializing the dealer and player cards, displaying the player's total, 
 * displaying the cards, checking for blackjack, and removing the start button if the game is in progress.
 *
 * @param {boolean} isFromRetry - indicates if the game is being rendered from a retry
 */
function renderGame(isFromRetry = null) {
    dealer.cards.push(...getRandomCard(2));
    player.cards.push(...getRandomCard(2));
    
    // Display player total
    playerTotalEl.textContent = player.sumOfCards();

    displayCards('dealer');
    displayCards('player');

    gameInProgress = true;
    isBlackJack();

    // Remove button start when start game
    if (gameInProgress) {
      let button_start_element = document.getElementById(btn_object_start.id);
      if (button_start_element) {
        button_start_element.remove();
      }

    if (isFromRetry === false) {
        btn_object_stand.render();
        btn_object_hit.render();
      }
    }
}

/**
 * Resets the game by removing buttons, resetting game status, cards, totals, and bet.
 *
 * @return {undefined} No return value.
 */
function resetGame() {
  if (player.chips > 0) {
    // Element reference and store to a variable.
    let button_hit_element = document.getElementById(btn_object_hit.id),
    button_stand_element = document.getElementById(btn_object_stand.id),
    button_retry_element = document.getElementById(btn_object_retry.id);
    
    // remove buttons
    button_retry_element.remove();

    if (button_hit_element && button_stand_element) {
      button_hit_element.remove();
      button_stand_element.remove();
    }

    // render place bet button
    btn_object_bet.render();

    // reset game status label
    updateGameStatusLabel("Let's play Blackjack!");

    // reset cards
    player.cards = [];
    dealer.cards = [];
    playerCardsEl.textContent = "";
    dealerCardsEl.textContent = "";

    // reset totals
    playerTotalEl.textContent = 0;
    dealerTotalEl.textContent = 0;

    // reset bet
    betAmount = 0;
    
  } else {
    alert("Gameover! You don't have any chips left. Please try again.");
    location.reload();
  }
}

/**
 * Checks if the player has a blackjack and the dealer does not have a blackjack.
 *
 * @return {undefined} This function does not return any value.
 */
function isBlackJack() {
  if (player.sumOfCards() === 21 && dealer.sumOfCards() !== 21) {
    dealerTotalEl.textContent = dealer.sumOfCards();
    playerTotalEl.textContent = player.sumOfCards();

    // show info on screen
    updateGameStatusLabel("Player got Blackjack! Player Wins!");
    displayCards('dealer-reveal');
    btn_object_retry.render();

    player.chips += parseInt(betAmount);
    updateChips();

    gameInProgress = false;

    // remove start button
    let button_start_element = document.getElementById(btn_object_start.id);
    if (button_start_element) {
      button_start_element.remove();
    }
  }
}

/**
 * Generates a new card for either the player or the dealer, depending on the value of isFromPlayer.
 *
 * @param {boolean} isFromPlayer - Indicates whether the card is for the player. Defaults to null.
 */
function hitCards(isFromPlayer = null) {
  if (gameInProgress) {
    if (isFromPlayer === true) {
        player.cards.push(...getRandomCard(1));
        playerTotalEl.textContent = player.sumOfCards();
        displayCards('player');
        isBlackJack();
        isBusted();
        dealerChoice();
    } else {
      dealer.cards.push(...getRandomCard(1));
      displayCards('dealer');
    }

    }
}

/**
 * Executes a series of actions when the game is over and the player stands.
 *
 * @return {undefined} This function does not return a value.
 */
function standCards() {
    if (gameInProgress) {
        checkWinner();
        updateChips();
        dealerTotalEl.textContent = dealer.sumOfCards();

        gameInProgress = false;
        btn_object_retry.render();
    }
}

/**
 * Executes a series of actions when the game is over and the player stands.
 *
 * @return {undefined} This function does not return a value.
 */
function dealerChoice() {
    if (gameInProgress) {
      const options = ["hit", "stand"];
      // Randomly choose an option
      const randomIndex = Math.floor(Math.random() * options.length);
      const chosenOption = options[randomIndex];

      while (chosenOption === "hit" && dealer.sumOfCards() < 17) {
        hitCards(false);
      }
    }
}

/**
 * Checks if the player is busted and performs necessary actions if true.
 *
 * @return {undefined} No return value.
 */
function isBusted() {
    let playerTotal = player.sumOfCards();
    if (playerTotal > 21) {
      updateGameStatusLabel("Busted! You Lose!");
      
      displayCards('dealer-reveal');
      dealerTotalEl.textContent = dealer.sumOfCards();

      player.chips -= parseInt(betAmount);
      
      updateChips();
      
      gameInProgress = false;
      btn_object_retry.render();
    }
} 

/**
 * Checks the winner of the game.
 *
 * @return {undefined} No return value
 */
function checkWinner() {
    if (gameInProgress) {
        let playerTotal = player.sumOfCards(),
        dealerTotal = dealer.sumOfCards();
        
    if (playerTotal > 21) {
        updateGameStatusLabel("Busted! You Lose!");
        player.chips -= parseInt(betAmount);

    } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
      updateGameStatusLabel("Player Wins!");
      player.chips += parseInt(betAmount);
    } else if (playerTotal < dealerTotal) {
      updateGameStatusLabel("Dealer Wins!");
      player.chips -= parseInt(betAmount);
    } else updateGameStatusLabel("It's a tie!");
    
    displayCards('dealer-reveal');
    displayCards('player');
    }
}

/**
 * Generates an array of random cards.
 *
 * @param {number} qty - The number of cards to generate.
 * @return {number[]} An array of random cards.
 */
function getRandomCard(qty) {
  const myMin = 1;
  const myMax = 12;
  const cards = [];

  for (let index = 0; index < qty; index++) {
    const randomNumber = Math.floor(Math.random() * (myMax - myMin + 1)) + myMin;

    if (randomNumber === 1) {
      cards.push(11); // Ace
    } else if (randomNumber > 10) {
      cards.push(10); // Face cards
    } else {
      cards.push(randomNumber);
    }
  }

  return cards;
}

/**
 * Updates the game status label with the given text.
 *
 * @param {string} text - The text to be displayed on the game status label.
 * @return {string} The updated text of the game status label.
 */
function updateGameStatusLabel(text) {
  return document.getElementById("game-status-label").textContent = text
}

/**
 * Display the cards based on the implementation type.
 *
 * @param {string} implementationType - The type of implementation (e.g. "dealer", "dealer-reveal", "player").
 */
function displayCards(implementationType) {
  switch  (implementationType) {
    case "dealer":
      dealerCardsEl.textContent = "";
      dealer.cards.forEach(function(item, index) {
        if (index === 0) {
          dealerCardsEl.textContent += `[${item}] `;
        } else dealerCardsEl.textContent += ` [?] `;
      });
      break;
    case "dealer-reveal":
      dealerCardsEl.textContent = "";
      dealer.cards.forEach(function(item, index) {
        dealerCardsEl.textContent += `[${item}] `;
      });
      break;
    case "player":
      playerCardsEl.textContent = "";
      player.cards.forEach(function(item, index) {
        playerCardsEl.textContent += `[${item}] `;
      });
      break;
  }
}

/**
 * Updates the chips display on the page.
 *
 * @param {number} player.chips - The number of chips the player has.
 * @return {void} This function does not return anything.
 */
function updateChips() {
  if (player.chips < 0) {
    alert("You're out of chips!");
    location.reload();
  }

  document.getElementById("player-chips").textContent = player.chips;
}

/**
 * Displays a custom prompt on the screen.
 *
 * @param {type} paramName - The ID of the custom prompt element.
 * @return {type} undefined - This function does not return a value.
 */
function showCustomPrompt() {
  const customPrompt = document.getElementById('custom-prompt');
  const overlay = document.getElementById('overlay');
  
  customPrompt.style.display = 'block';
  overlay.style.display = 'block';
}

/**
 * Submits the custom prompt.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function submitCustomPrompt() {
  betAmount = document.getElementById('betAmount').value;   
  if (betAmount > 0 && betAmount <= player.chips) {
    button_bet_element = document.getElementById(btn_object_bet.id);
    button_bet_element.remove();
    btn_object_start.render();
  } else {
    alert("Invalid bet amount!");
  }

  hideCustomPrompt();
}

/**
 * Cancels the custom prompt.
 *
 * @param {type} None - This function does not accept any parameters.
 * @return {type} None - This function does not return any value.
 */
function cancelCustomPrompt() {
  hideCustomPrompt();
}

/**
 * Hides the custom prompt and overlay elements.
 *
 * @return {void} No return value.
 */
function hideCustomPrompt() {
  const customPrompt = document.getElementById('custom-prompt');
  const overlay = document.getElementById('overlay');

  customPrompt.style.display = 'none';
  overlay.style.display = 'none';
}