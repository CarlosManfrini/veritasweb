const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

// Tamaño de los bloques
const tileSize = 52;

// Pac-Man inicial
let pacman = {
    x: tileSize,
    y: tileSize,
    size: tileSize - 15,
    speed: tileSize,
    direction: { x: 0, y: 0 }
};

// Laberinto básico (0 = camino, 1 = pared)
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Dibujar el laberinto
function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = "red";
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }
}

// Dibujar Pac-Man
function drawPacman() {
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.arc(pacman.x + pacman.size / 2, pacman.y + pacman.size / 2, pacman.size / 2, 0.2 * Math.PI, 1.8 * Math.PI); // boca abierta
    ctx.lineTo(pacman.x + pacman.size / 2, pacman.y + pacman.size / 2); // línea a la boca
    ctx.fill();
}

// Detectar colisiones con paredes
function canMove(x, y) {
    let row = Math.floor(y / tileSize);
    let col = Math.floor(x / tileSize);
    return maze[row][col] === 0;
}

// Actualizar el estado de Pac-Man
function update() {
    let newX = pacman.x + pacman.direction.x * pacman.speed;
    let newY = pacman.y + pacman.direction.y * pacman.speed;

    if (canMove(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
    drawMaze(); // Redibujar el laberinto
    drawPacman(); // Dibujar Pac-Man
}

// Escuchar las teclas del usuario
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            pacman.direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            pacman.direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            pacman.direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            pacman.direction = { x: 1, y: 0 };
            break;
    }
});

// Loop principal del juego
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
