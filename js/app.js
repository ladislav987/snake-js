// listeners
document.addEventListener("keydown", keyPush);

// canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// h1
const title = document.querySelector('h1');

// game
let gameIsRunning = true;
const tileSize = 50;
const tileCountX = canvas.width / tileSize;
const tileCountY = canvas.height / tileSize;

let score = 0;
let fps = 15;

// player

let snakeSpeed = 50;
let snakePosX = 0;
let snakePosY = canvas.height / 2;

let velocityX = 1;
let velocityY = 0;

let tail = [];
let snakeLength = 2;

// food
let foodPosX = 0;
let foodPosY = 0;


// loop
function gameLoop() {
    if (gameIsRunning) {
        drowStuff();
        moveSnake();
        setTimeout(gameLoop, 1000 / fps)
    }
}

resetFood();
gameLoop();

/**
 * MOVE SNAKE
 */
function moveSnake() {
    snakePosX += snakeSpeed * velocityX;
    snakePosY += snakeSpeed * velocityY;

    // wall collision
    if (snakePosX > (canvas.width - tileSize)) {
        snakePosX = 0;
    }

    if (snakePosX < 0) {
        snakePosX = canvas.width;
    }

    if (snakePosY > (canvas.height - tileSize)) {
        snakePosY = 0;
    }

    if (snakePosY < 0) {
        snakePosY = canvas.height;
    }

    // GAME OVER
    tail.forEach(snakePart => {
        if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
            gameOver();
        }
    });

    // tail
    tail.push({ x: snakePosX, y: snakePosY });

    // forget earliest parts of snake
    tail = tail.slice(-1 * snakeLength);


    // food colision
    if (snakePosX === foodPosX && snakePosY === foodPosY) {
        title.textContent = ++score;
        resetFood();
        snakeLength++;
    }
}

/**
 * DRAW EVERYTHING
 */
function drowStuff() {
    // background
    rectangle("#ffbf00", 0, 0, canvas.width, canvas.height);

    // grid
    drowGrid();

    // tail
    tail.forEach(snakePart => {
        rectangle('#555', snakePart.x, snakePart.y, tileSize, tileSize);
    });

    // snake
    rectangle("black", snakePosX, snakePosY, tileSize, tileSize);

    // food
    rectangle("#00bfff", foodPosX, foodPosY, tileSize, tileSize);

}

/**
 * DRAW RECTANGLE
 */
function rectangle(color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

/**
 * MOVING WITH KEYS
 */
function keyPush(event) {
    switch (event.key) {
        case "ArrowLeft":
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case "ArrowUp":
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case "ArrowDown":
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case "ArrowRight":
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;

        default:
            // restart game
            if (!gameIsRunning) {
                location.reload();
            }
            break;
    }
}

/**
 * DROW GRID
 */
function drowGrid() {

    for (let i = 0; i < tileCountX; i++) {
        for (let j = 0; j < tileCountY; j++) {
            rectangle("#fff", tileSize * i, tileSize * j, tileSize - 1, tileSize - 1)
        }

    }
}

/**
 * CALCULATES RANDOM POSITION FOR FOOD
 */
function resetFood() {
    if (snakeLength === tileCountX * tileCountY) {
        gameOver();
    }

    foodPosX = Math.floor(Math.random() * tileCountX) * tileSize;
    foodPosY = Math.floor(Math.random() * tileCountY) * tileSize;

    // dont spawn food on snake head
    if (tail.some(snakePart => snakePart.x === foodPosX && snakePart.y === foodPosY)) {
        resetFood();
    }

    // dont spawn food on any snake part

}

/**
 * GAME OVER
 */
function gameOver() {
    title.innerHTML = `💀 <strong> ${score} </strong> 💀`
    gameIsRunning = false;
}