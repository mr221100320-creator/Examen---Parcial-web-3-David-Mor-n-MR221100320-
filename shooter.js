// Archivo: shooter.js

const canvas = document.getElementById('shooterCanvas');
const ctx = canvas.getContext('2d');
const startGameButton = document.getElementById('startGameButton');
const scoreDisplay = document.getElementById('score');

// --- Variables de Juego ---
let player = { x: canvas.width / 2, y: canvas.height - 30, width: 30, height: 20, speed: 5, isShooting: false };
let bullets = [];
let enemies = [];
let score = 0;
let gameRunning = false;
let gameInterval;

// --- Controles de Teclado ---
let keys = {};
document.addEventListener('keydown', (e) => { 
    keys[e.code] = true; 
    
    // 🌟 NUEVO: Previene el scroll del navegador para las teclas de control
    if (e.code === 'Space' || e.code === 'KeyS' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault(); 
    }
});
document.addEventListener('keyup', (e) => { keys[e.code] = false; });

// --- Funciones de Dibujo ---

function drawPlayer() {
    ctx.fillStyle = '#00B4D8'; // Color de la nave
    ctx.fillRect(player.x - player.width / 2, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = '#FFC107'; // Color de las balas (Amarillo)
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x - 2, bullet.y, 4, 8); // Dibuja la bala
    });
}

function drawEnemies() {
    ctx.fillStyle = '#FF6B6B'; // Color de los enemigos (Rojo)
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x - enemy.width / 2, enemy.y, enemy.width, enemy.height);
    });
}

// --- Lógica del Juego ---

function updateGame() {
    if (!gameRunning) return;

    // 1. Movimiento del Jugador (Nave)
    if (keys['ArrowLeft'] && player.x > player.width / 2) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width / 2) {
        player.x += player.speed;
    }

    // 2. Disparo de Balas (AHORA CON LA TECLA S)
    const isSPressed = keys['KeyS']; // Detecta la tecla 'S'

    if (isSPressed && !player.isShooting) {
        // Añade una nueva bala
        bullets.push({ x: player.x, y: player.y - 10, speed: 7 });
        player.isShooting = true;
        
        // Evita disparos continuos manteniendo la tecla pulsada
        setTimeout(() => { player.isShooting = false; }, 200); 
    }

    // 3. Mover Balas
    bullets.forEach(bullet => {
        bullet.y -= bullet.speed;
    });
    // Elimina las balas que salen de la pantalla
    bullets = bullets.filter(bullet => bullet.y > 0);

    // 4. Mover y Generar Enemigos
    if (Math.random() < 0.02) { // Probabilidad de generar un enemigo
        enemies.push({ 
            x: Math.random() * (canvas.width - 40) + 20, 
            y: 0, 
            width: 20, 
            height: 15, 
            speed: Math.random() * 1 + 1 
        });
    }

    enemies.forEach(enemy => {
        enemy.y += enemy.speed;

        // 5. Colisión Enemigo-Suelo (Game Over)
        if (enemy.y + enemy.height > canvas.height) {
            gameOver();
        }
    });

    // 6. Detección de Colisiones (Bala vs. Enemigo)
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x > enemy.x - enemy.width / 2 && 
                bullet.x < enemy.x + enemy.width / 2 && 
                bullet.y < enemy.y + enemy.height && 
                bullet.y > enemy.y
            ) {
                // Colisión detectada: eliminar ambos
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score++;
                scoreDisplay.textContent = score;
            }
        });
    });
    
    // 7. Colisión Enemigo-Jugador (Game Over)
    enemies.forEach(enemy => {
        if (
            player.x + player.width / 2 > enemy.x - enemy.width / 2 &&
            player.x - player.width / 2 < enemy.x + enemy.width / 2 &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            gameOver();
        }
    });
}

function gameLoop() {
    // 1. Limpiar Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Dibujar y Actualizar
    updateGame();
    drawPlayer();
    drawBullets();
    drawEnemies();

    // 3. Llamar al siguiente frame
    if (gameRunning) {
        gameInterval = requestAnimationFrame(gameLoop);
    }
}

// --- Controles y Estado ---

function resetGame() {
    player = { x: canvas.width / 2, y: canvas.height - 30, width: 30, height: 20, speed: 5, isShooting: false };
    bullets = [];
    enemies = [];
    score = 0;
    scoreDisplay.textContent = 0;
    
    // Limpiar Canvas y dibujar la nave inicial
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawPlayer();

    startGameButton.textContent = 'Comenzar Juego';
    startGameButton.style.backgroundColor = '#28a745';
    startGameButton.style.display = 'block';
}

function startGame() {
    if (!gameRunning) {
        resetGame();
        gameRunning = true;
        startGameButton.style.display = 'none';
        gameLoop();
    }
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(gameInterval);
    ctx.fillStyle = 'red';
    ctx.font = '30px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('¡DESTRUIDO!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText(`Puntuación: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

    startGameButton.textContent = 'Volver a Jugar';
    startGameButton.style.backgroundColor = 'var(--color-principal)';
    startGameButton.style.display = 'block';
}

// --- Event Listeners ---
startGameButton.addEventListener('click', startGame);

// Inicializa el juego al cargar la página
resetGame();