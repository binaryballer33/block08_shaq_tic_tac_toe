// ask player1 if they want heads or tails and flip the coin to decide who goes first
const headsOrTails = prompt("Choose Heads or Tails", "Heads").toLowerCase();
const coinFlip = Math.random() > .5 ? 'heads' : 'tails';
let playerMarker = headsOrTails === coinFlip ? 'X' : 'O'

// assign player marker. choose 'heads' or 'tails' 
let currentPlayer = document.getElementById('currentPlayerMarker');
currentPlayer.innerHTML = `<h1>Player ${playerMarker}</h1>`

// get the element to check for wins or ties
let winOrTie = document.getElementById('winOrTie');

// get the element to ask if players want to play again
let playAgain = document.getElementById('playAgain')
playAgain.addEventListener('click', playAgainEventListener)

// get the element used to switch turns
let turnSwitcher = document.getElementById('turnSwitcher');
turnSwitcher.addEventListener('click', turnSwitcherEventListener)

// create this controller to remove position event listeners after someone has won
const abortController = new AbortController();

// create the positions and put a element at index 0 to make the indexing of this array more understandable, positions[0] is just a filler element
const positions = [document.createElement('div')];
for (let i = 1; i < 10; i++) positions.push(document.getElementById(`position${i}`));

// assign each position an onclick event listener for placing markers on board
positions.forEach((position) => position.addEventListener('click', () => positionEventListener(position), { signal: abortController.signal }))

// return the opposite marker for turn switching and printing to the dom purposes
function getOppositeMarker() { 
    return playerMarker === 'X' ? 'O' : 'X' 
}

// removes element from dom, adds another and returns true
function modifyDomReturnTrue(winPosition1, winPosition2, winPosition3) {
    if (!winOrTie.innerHTML) winOrTie.innerHTML = `<h1>Player ${getOppositeMarker()} Won!!!</h1>`;
    if (!playAgain.innerHTML) playAgain.innerHTML = '<button class="playAgain">Play Again</button>'
    
    // JSConfetti is created through the script in the index.html
    const jsConfetti = new JSConfetti()
    jsConfetti.addConfetti()
    
    // highlight the winning combination with a bright noticable color
    winPosition1.classList.add('winningCombination')
    winPosition2.classList.add('winningCombination')
    winPosition3.classList.add('winningCombination')
    document.body.classList.add("winningBackgroundGradient")

    currentPlayer.remove(); 
    turnSwitcher.removeEventListener('click', turnSwitcherEventListener)
    
    // removes the event listener from each position html element after player has won
    abortController.abort();
    
    return true 
}

// at the end of each move check to see if the player won
function checkForWin() {
    // horizontal win checks
    if (positions[1].innerText && positions[1].innerText === positions[2].innerText && positions[2].innerText === positions[3].innerText) { 
        return modifyDomReturnTrue(positions[1], positions[2], positions[3])
    }
    if (positions[4].innerText && positions[4].innerText === positions[5].innerText && positions[5].innerText === positions[6].innerText) { 
        return modifyDomReturnTrue(positions[4], positions[5], positions[6])
    }
    if (positions[7].innerText && positions[7].innerText === positions[8].innerText && positions[8].innerText === positions[9].innerText) { 
        return modifyDomReturnTrue(positions[7], positions[8], positions[9])
    }
    
    // vertical win checks
    if (positions[1].innerText && positions[1].innerText === positions[4].innerText && positions[4].innerText === positions[7].innerText) { 
        return modifyDomReturnTrue(positions[1], positions[4], positions[7])
    }
    if (positions[2].innerText && positions[2].innerText === positions[5].innerText && positions[5].innerText === positions[8].innerText) { 
        return modifyDomReturnTrue(positions[2], positions[5], positions[8])
    }
    if (positions[3].innerText && positions[3].innerText === positions[6].innerText && positions[6].innerText === positions[9].innerText) { 
        return modifyDomReturnTrue(positions[3], positions[6], positions[9])
    }
    
    // diagonal win checks
    if (positions[1].innerText && positions[1].innerText === positions[5].innerText && positions[5].innerText === positions[9].innerText) { 
        return modifyDomReturnTrue(positions[1], positions[5], positions[9])
    }
    if (positions[3].innerText && positions[3].innerText === positions[5].innerText && positions[5].innerText === positions[7].innerText) { 
        return modifyDomReturnTrue(positions[3], positions[5], positions[7])
    }
    
    return false;
}

// if the board is full and nobody won mark the game as a tie
function checkForTie() {
    // start at 1 because position 0 is a filler position
    for (let i = 1; i < positions.length; i++) {
        if (positions[i].innerText === "") return ""
    }

    currentPlayer.remove()
    if (!playAgain.innerHTML) playAgain.innerHTML = '<button class="playAgain">Play Again</button>'
    winOrTie.innerHTML = `<h1>There Was A Tie</h1>`
}

// event listeners 
function turnSwitcherEventListener() {
    playerMarker = getOppositeMarker();
    currentPlayer.innerHTML = `<h1>Player ${playerMarker}</h1>`
}

function positionEventListener(position) {
    // if there's no 'X' or 'O' here, then you can place your marker
    if (!position.innerText) {
        position.innerText = playerMarker;
        turnSwitcher.click()
    }

    let win = checkForWin() // after each move check to see if someone won
    if (!win) checkForTie() // if no one won then check to see if there's a tie
}

function playAgainEventListener() {
    location.reload();
}
