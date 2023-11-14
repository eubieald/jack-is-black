const initialChips = 100;

function User(name) {
  this.name = name;
  this.chips = initialChips;
  this.cards = [];
  // create method
  this.sumOfCards = function() {
    return this.cards.reduce((accumulator, curr_value) => accumulator + curr_value, 0);
  }
}

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

// Create start button
const btn_object_start = new Buttons("btn-start", "Start Game", "button-wrapper", () => {
  renderGame();
});

const btn_object_stand = new Buttons("btn-stand", "Stand", "button-wrapper", () => {
  standCards();
});

const btn_object_hit = new Buttons("btn-hit", "Hit", "button-wrapper", () => {
  hitCards(true);
});

const btn_object_retry = new Buttons("btn-retry", "Retry", "button-wrapper", () => {
  resetGame();
});

const btn_object_bet = new Buttons("btn-bet", "Place a Bet", "button-wrapper", () => {
  placeBet();
});

btn_object_bet.render();


let dealer = new User('Dealer', 100);
let player = new User('Eubie', 100);

let gameInProgress = false,
hasBlackJack = false,
revealDealerCards = false;

let playerCardsEl = document.getElementById('player-cards'),
    dealerCardsEl = document.getElementById('dealer-cards');

let playerTotalEl = document.getElementById('player-total'),
    dealerTotalEl = document.getElementById('dealer-total');

let playerChipsEl = document.getElementById('player-chips');

let betAmount = 0;

function placeBet() {
    betAmount = getBetAmount();
    button_bet_element = document.getElementById(btn_object_bet.id);

    button_bet_element.remove();
    btn_object_start.render();
}

function renderGame(isFromRetry = null) {
    dealer.cards.push(...getRandomCard(2));
    player.cards.push(...getRandomCard(2));
    
    // Display player total
    playerTotalEl.textContent = player.sumOfCards();

    displayCards('dealer');
    displayCards('player');
    gameInProgress = true;
    isBlackJack();
    updateChips();

    // Remove button start when start game
    if (gameInProgress) {
      let button_start_element = document.getElementById(btn_object_start.id);
      if (button_start_element) {
        button_start_element.remove();
      }

    if (!isFromRetry) {
        btn_object_stand.render();
        btn_object_hit.render();
      }
    }
}

function resetGame() {
  if (player.chips > 0) {
    betAmount = getBetAmount();
    let button_retry_element = document.getElementById(btn_object_retry.id);
    button_retry_element.remove();
  
    updateGameStatusLabel("Let's play Blackjack!");
    player.cards = [];
    dealer.cards = [];
    renderGame(true);
  } else {
    alert("Gameover! You don't have any chips left. Please try again.");
    location.reload();
  }
}

function isBlackJack() {
  if (player.sumOfCards() === 21 && dealer.sumOfCards() !== 21) {
      updateGameStatusLabel("Player got Blackjack! Player Wins!");
      dealerTotalEl.textContent = dealer.sumOfCards();
      playerTotalEl.textContent = player.sumOfCards();

      player.chips += parseInt(betAmount);
      gameInProgress = false;
  }
}

function hitCards(isFromPlayer = null) {
  if (gameInProgress) {
    if (isFromPlayer === true) {
        player.cards.push(...getRandomCard(1));
        playerTotalEl.textContent = player.sumOfCards();
        displayCards('player');
        isBusted();
        dealerChoice();
    } else {
      dealer.cards.push(...getRandomCard(1));
      displayCards('dealer');
    }

    }
}

function standCards() {
    if (gameInProgress) {
        checkWinner();
        updateChips();
        dealerTotalEl.textContent = dealer.sumOfCards();

        gameInProgress = false;
        btn_object_retry.render();
    }
}

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

function updateChips() {
  if (player.chips < 0) {
    alert("You're out of chips!");
    location.reload();
  }

  document.getElementById("player-chips").textContent = player.chips;
}

function getBetAmount() {
  let userInput;
  let isValid = false;

  while (!isValid) {
    userInput = prompt("Place a bet:");

    // Check if the entered value is a number
    isValid = !isNaN(userInput) && userInput !== '' && userInput !== null && userInput !== undefined;

    if (!isValid) {
      alert("Invalid input. Please enter a valid number.");
    }
  }

  return parseFloat(userInput);
}