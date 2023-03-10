document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector(".grid");
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const btnRotate = document.querySelector(".btn-rotate");
  const btnLeft = document.querySelector(".btn-aside__left");
  const btnRight = document.querySelector(".btn-aside__right");
  const btnDown = document.querySelector(".btn-down");
  const width = 10; // Number of DIVs across the display
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = ["green", "red", "blue", "blueviolet", "brown"];
  // const WIDTH = 14;
  // const HEIGHT = 16;
  // const AREA = WIDTH * HEIGHT;

  // Create grid board
    function creatDivs(parentBlock, numDivs, className) {
      for (let i = 0; i < numDivs; i++) {
        let divs = document.createElement("div");
        if (className !== undefined) {
          divs.classList.add(className);
        }
        parentBlock.appendChild(divs);
        console.log(className);
      }
    }
  creatDivs(grid, 200);
  creatDivs(grid, 10, 'taken');

  let squares = Array.from(document.querySelectorAll(".grid div"));

  // The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width * 2 + 1, width + 1],
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width * 2 + 1, width + 1],
    [width * 2, width * 2 + 1, width + 1, width + 2],
  ];

  const tTetromino = [
    [width, width + 1, 1, width + 2],
    [1, width + 1, width * 2 + 1, width + 2],
    [width, width + 1, width * 2 + 1, width + 2],
    [width, width + 1, 1, width * 2 + 1],
  ];

  const sTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const stTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    sTetromino,
    stTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //draw the Tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  /*  make the tetromino move down every seconds 
  and invoked on the load of the browser */
  // timerId = setInterval(moveDown, 500);

  // assign function to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keyup", control);

  // functionality for controls buttons
  btnRotate.addEventListener("click", rotate);
  btnLeft.addEventListener("click", moveLeft);
  btnRight.addEventListener("click", moveRight);
  btnDown.addEventListener("click", moveDown);

  // move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      // start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  // move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  // move the tetromino left, unless is at the edge or there is a blockage
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  // rotate the tetromino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      // if the current rotation gets to 4, make it go back to 0
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // show up-next tetromino in mini-grid display
  const miniGrid = document.querySelector(".mini-grid");
  const displayWidth = 4;
  const displayIndex = 0;

  // Create mini-grid board
   creatDivs(miniGrid, 16);

  const displaySquares = document.querySelectorAll(".mini-grid div");

  // the Tetrominoes without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
    [0, displayWidth, displayWidth * 2 + 1, displayWidth + 1], // zTetromino
    [displayWidth, displayWidth + 1, 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // sTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // stTetromino
  ];

  // display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino from the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });

    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  // add functionality to the button
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, addSpeed());
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  //add speed
  function addSpeed() {
    let data = document.querySelector("#speed").value;
    console.log(data)
    return data;
  }

  // add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  // game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerText = "The END";
      clearInterval(timerId);
    }
  }
})

