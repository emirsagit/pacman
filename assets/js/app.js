const width = 28;
const grid = document.querySelector(".grid");
const messageSection = document.querySelector(".message-section");
const scoreDisplay = document.getElementById("score");
const messageTitle = document.getElementById("message-title");
const btnContinue = document.getElementById("btn-continue");
const pacmanSpeed = 300; //same as ghost speed
const directions = [1, -1, width, -width];
const initialPacmanIndex = 490;

let won = false;
let ghostsScared = false;
let pacmanCurrentIndex = initialPacmanIndex;
let direction = 0;
let squares = [];
let intervalCheckWall = "";
let intervalPacmanMove = "";
let score = 0;

// 0 - pacdots, inside-game
// 1 - wall
// 2 - ghost lair
// 3 - powerpellets
// 4 - empty

const layout = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1, 1, 0,
  1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
  1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 2, 2, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 1, 2, 2, 2, 2, 2,
  2, 1, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4,
  4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 3, 0, 0, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0,
  0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

const checkWall = (rotation) => {
  return layout[pacmanCurrentIndex + rotation] === 1;
};

const checkGameOver = () => {
  if (squares[pacmanCurrentIndex].classList.contains("ghost") && !ghostsScared) {
    console.log("3");
    gameOver();
  }
};

const checkForWinning = () => {
  if (score >= 1000) {
    won = true;
    stopAll();
    messageTitle.textContent = "YOU WON!";
  }
};

const pacmanAteApple = () => {
  squares[pacmanCurrentIndex].classList.remove("pac-dot");
  score += 5;
  scoreDisplay.innerHTML = score;
};

const pacmanAtePowerPellet = () => {
  ghostScared = true;
  squares[pacmanCurrentIndex].classList.remove("power-pellet");
  score += 50;
  scoreDisplay.innerHTML = score;
  ghosts.forEach((ghost) => {
    ghost.atePowerPellet();
  });
  setTimeout(() => {
    ghostsScared = false;
    ghosts.forEach((ghost) => {
      ghost.isScared = false;
    });
  }, 15000);
};

const addClassToPacman = () => {
  switch (direction) {
    case 1:
      squares[pacmanCurrentIndex].classList.add("pacman", "rotate-right");
      break;
    case -1:
      squares[pacmanCurrentIndex].classList.add("pacman", "rotate-left");
      break;
    case width:
      squares[pacmanCurrentIndex].classList.add("pacman", "rotate-bottom");
      break;
    case -width:
      squares[pacmanCurrentIndex].classList.add("pacman", "rotate-top");
      break;
    default:
      squares[pacmanCurrentIndex].classList.add("pacman");
      break;
  }
};

const continueGame = () => {
  messageSection.classList.add("display-none");
  move();
  ghosts.forEach((ghost) => {
    ghost.move();
  });
};

const gameOver = (ghost = null) => {
  if (ghost) {
    ghost.resetGhost();
  }
  squares[pacmanCurrentIndex].classList = "";
  pacmanCurrentIndex = initialPacmanIndex;
  squares[pacmanCurrentIndex].classList.add("pacman");
  messageTitle.textContent = "GAME OVER!";
  stopAll();
};

const stopAll = () => {
  ghosts.forEach((ghost) => {
    clearInterval(ghost.timerId);
  });
  clearInterval(intervalPacmanMove);
  messageSection.classList.remove("display-none");
};

const move = () => {
  intervalPacmanMove = setInterval(() => {
    won ? "" : checkForWinning();
    squares[pacmanCurrentIndex].classList.remove(
      "pacman",
      "rotate-right",
      "rotate-left",
      "rotate-bottom",
      "rotate-top"
    );
    if (direction === 1 && pacmanCurrentIndex === 391) {
      pacmanCurrentIndex = 364;
    } else if (direction === -1 && pacmanCurrentIndex === 364) {
      pacmanCurrentIndex = 391;
    } else {
      if (checkWall(direction)) {
        direction = 0;
      }
      pacmanCurrentIndex += direction;
    }
    addClassToPacman();
    if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
      pacmanAteApple();
    }
    if (squares[pacmanCurrentIndex].classList.contains("power-pellet")) {
      pacmanAtePowerPellet();
    }
    if (!ghostsScared && squares[pacmanCurrentIndex].classList.contains("ghost")) {
      console.log("1");
      gameOver();
    }
  }, pacmanSpeed);
};

/**
 * Creates Board child divs
 * Pushs divs to the squares array
 */
const createBoard = () => {
  for (let i in layout) {
    let newDiv = document.createElement("div");
    grid.appendChild(newDiv);
    squares.push(newDiv);

    if (layout[i] === 0) {
      squares[i].classList.add("pac-dot", "inside-game");
    } else if (layout[i] === 1) {
      squares[i].classList.add("wall");
    } else if (layout[i] === 2) {
      squares[i].classList.add("ghost-lair");
    } else if (layout[i] === 3) {
      squares[i].classList.add("power-pellet");
    } else if (layout[i] === 4) {
      squares[i].classList.add("empty");
    }
  }

  squares[pacmanCurrentIndex].classList.add("pacman");
  move();
};

const changeDirectionWhenPossible = (rotation) => {
  if (intervalCheckWall) {
    clearInterval(intervalCheckWall);
  }
  intervalCheckWall = setInterval(() => {
    if (!checkWall(rotation)) {
      direction = rotation;
      clearInterval(intervalCheckWall);
    }
  }, pacmanSpeed / 2);
};

/**
 * Decides which direction Pacman will go
 */
const control = (e) => {
  switch (e.code) {
    case "ArrowUp":
      changeDirectionWhenPossible(-width);
      break;
    case "ArrowDown":
      changeDirectionWhenPossible(width);
      break;
    case "ArrowRight":
      changeDirectionWhenPossible(1);
      break;
    case "ArrowLeft":
      changeDirectionWhenPossible(-1);
      break;
  }
};

document.addEventListener("keyup", control);
btnContinue.addEventListener("click", continueGame);

createBoard();

class Ghost {
  constructor(className, startIndex, speed, directions) {
    let elements = {
      className,
      startIndex,
      speed,
      directions,
      currentIndex: startIndex,
      isScared: false,
      timerId: NaN,
      direction: 1,
    };
    Object.assign(this, elements);
  }

  move() {
    this.timerId = setInterval(() => {
      if ((ghostsScared || this.isScared) && squares[this.currentIndex].classList.contains("pacman")) {
        this.resetGhost();
        score += 50;
        scoreDisplay.innerHTML = score;
      }
      let freeDirection = "";
      1 === Math.abs(this.direction) ? (freeDirection = this.directions[2]) : (freeDirection = 1);
      if (
        squares[this.currentIndex].classList.contains("ghost-lair") ||
        squares[this.currentIndex].classList.contains("ghost-lair") ||
        squares[this.currentIndex + freeDirection].classList.contains("inside-game") ||
        squares[this.currentIndex - freeDirection].classList.contains("inside-game")
      ) {
        this.#changeDirection();
        if (!this.#checkWall()) {
          this.#moving();
        }
      } else {
        while (this.#checkWall()) {
          this.#changeDirection();
        }
        this.#moving();
      }
      if (squares[this.currentIndex].classList.contains("pacman")) {
        if (this.isScared || ghostsScared) {
          this.resetGhost();
          score += 50;
          scoreDisplay.innerHTML = score;
        } else {
          gameOver(this);
        }
      }
    }, this.speed);
  }

  resetGhost() {
    squares[this.currentIndex].classList.remove(this.className, "ghost", "scared");
    this.currentIndex = this.startIndex;
    squares[this.currentIndex].classList.add(this.className, "ghost");
  }

  atePowerPellet() {
    this.isScared = true;
  }

  #moving() {
    squares[this.currentIndex].classList.remove(this.className, "ghost", "scared");
    this.currentIndex += this.direction;
    if (this.isScared) {
      squares[this.currentIndex].classList.add("scared");
    } else {
      squares[this.currentIndex].classList.add(this.className, "ghost");
    }
  }

  #changeDirection() {
    let rndDirection = this.#getRndDirection(directions);
    const modulePacman = pacmanCurrentIndex % width;
    const moduleGhost = this.currentIndex % width;
    const divisionPacman = Math.floor(pacmanCurrentIndex / width);
    const divisionGost = Math.floor(this.currentIndex / width);
    if (squares[this.currentIndex].classList.contains("ghost-lair") || this.isScared) {
      this.direction = rndDirection;
    } else if (pacmanCurrentIndex > this.currentIndex) {
      if (modulePacman === moduleGhost) {
        rndDirection = this.#getRndDirection([1, -1]);
        this.#isEmptyPossibleNextDirection(width) ? (this.direction = width) : (this.direction = rndDirection);
      } else if (divisionPacman === divisionGost) {
        rndDirection = this.#getRndDirection([width, -width]);
        this.#isEmptyPossibleNextDirection(1) ? (this.direction = 1) : (this.direction = rndDirection);
      } else {
        rndDirection = this.#getRndDirection([width, 1, -1]);
        this.direction = rndDirection;
      }
    } else {
      if (modulePacman === moduleGhost) {
        rndDirection = this.#getRndDirection([1, -1]);
        this.#isEmptyPossibleNextDirection(-width) ? (this.direction = -width) : (this.direction = rndDirection);
      } else if (divisionPacman === divisionGost) {
        rndDirection = this.#getRndDirection([width, -width]);
        this.#isEmptyPossibleNextDirection(-1) ? (this.direction = -1) : (this.direction = rndDirection);
      } else {
        rndDirection = this.#getRndDirection([-width, 1, -1]);
        this.direction = rndDirection;
      }
    }
  }

  #checkWall() {
    return squares[this.currentIndex + this.direction].classList.contains("wall");
  }

  #isEmptyPossibleNextDirection(direction) {
    return !squares[this.currentIndex + direction].classList.contains("wall");
  }

  #getRndDirection(directions) {
    return directions[Math.floor(Math.random() * directions.length)];
  }
}

const ghosts = [
  new Ghost("blinky", 294, pacmanSpeed, directions),
  new Ghost("pinky", 293, pacmanSpeed, directions),
  new Ghost("inky", 351, pacmanSpeed, directions),
  new Ghost("clyde", 379, pacmanSpeed, directions),
];

ghosts.forEach((ghost) => {
  squares[ghost.startIndex].classList.add(ghost.className, "ghost");
  ghost.move();
});
