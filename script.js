const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const snakeColor = "#4CAF50"; // সাপের সবুজ রঙ
const snakeEyeColor = "#fff"; // সাপের চোখের রঙ

let snake = [{ x: 10, y: 10 }];
let direction = "right";
let food = { x: 5, y: 5, size: "small" };
let score = 0;
let speed = 0.3;
let gameOver = false;
let soundEnabled = true;
let gameInterval;

canvas.width = 400;
canvas.height = 400;

const gameLoop = () => {
    if (gameOver) return;

    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    drawScore();
};

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawSnake = () => {
    snake.forEach((segment, index) => {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);

        // সাপের চোখ যোগ করা
        if (index === 0) {
            ctx.fillStyle = snakeEyeColor;
            ctx.beginPath();
            ctx.arc(segment.x * 20 + 5, segment.y * 20 + 5, 3, 0, Math.PI * 2, true); // বাম চোখ
            ctx.arc(segment.x * 20 + 15, segment.y * 20 + 5, 3, 0, Math.PI * 2, true); // ডান চোখ
            ctx.fill();
        }
    });
};

const moveSnake = () => {
    let head = { ...snake[0] };

    if (direction === "right") head.x++;
    if (direction === "left") head.x--;
    if (direction === "up") head.y--;
    if (direction === "down") head.y++;

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += food.size === "small" ? 5 : 10;
        spawnFood();
        playSound("eat");
    } else {
        snake.pop();
    }
};

const spawnFood = () => {
    const size = Math.random() < 0.5 ? "small" : "large";  // বড় বা ছোট খাবার নির্বাচন
    food = {
        x: Math.floor(Math.random() * (canvas.width / 20)),
        y: Math.floor(Math.random() * (canvas.height / 20)),
        size: size
    };
};

const drawFood = () => {
    ctx.fillStyle = food.size === "small" ? "#FF6347" : "#FFD700";  // ছোট খাবারের জন্য টমেটো রঙ এবং বড় খাবারের জন্য সোনালী রঙ
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
};

const checkCollision = () => {
    let head = snake[0];

    // সাপের নিজে সাথে ধাক্কা খাওয়া
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        playSound("gameover");
        alert("Game Over!");
    }

    // স্ক্রীনের বাইরে চলে গেলে গেম ওভার
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width / 20 || head.y >= canvas.height / 20) {
        gameOver = true;
        playSound("gameover");
        alert("Game Over!");
    }
};

const drawScore = () => {
    document.getElementById("scoreDisplay").textContent = "Score: " + score;
};

const startGame = () => {
    snake = [{ x: 10, y: 10 }];
    score = 0;
    gameOver = false;
    spawnFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 2000 / speed);
};

const playSound = (type) => {
    if (!soundEnabled) return;

    let sound = new Audio();
    if (type === "gameover") {
        sound.src = "gameover.mp3";  // গেম ওভার সাউন্ড
    } else if (type === "eat") {
        sound.src = "eat.mp3";  // খাবার খাওয়ার সাউন্ড
    }
    sound.play();
};

// Start button event
document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("gameHeader").style.display = "flex";
    document.getElementById("controls").style.display = "block";
    startGame();
});

// Pause button event
document.getElementById("pauseButton").addEventListener("click", () => {
    clearInterval(gameInterval);
});

// Settings button event
document.getElementById("settingsButton").addEventListener("click", () => {
    document.getElementById("settingsModal").style.display = "flex";
});

// Close settings modal
document.getElementById("closeSettings").addEventListener("click", () => {
    document.getElementById("settingsModal").style.display = "none";
});

// Speed control event
document.getElementById("speedControl").addEventListener("change", (e) => {
    speed = parseFloat(e.target.value);
    if (!gameOver) {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 2000 / speed);
    }
});

// Sound toggle event
document.getElementById("soundToggle").addEventListener("change", (e) => {
    soundEnabled = e.target.checked;
});

// Control button events
document.getElementById("upButton").addEventListener("click", () => {
    if (direction !== "down") direction = "up";
});
document.getElementById("downButton").addEventListener("click", () => {
    if (direction !== "up") direction = "down";
});
document.getElementById("leftButton").addEventListener("click", () => {
    if (direction !== "right") direction = "left";
});
document.getElementById("rightButton").addEventListener("click", () => {
    if (direction !== "left") direction = "right";
});