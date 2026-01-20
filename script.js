// Lógica do Jogo Snake Reverse

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Constantes do jogo
const GRID_SIZE = 20;
const TILE_SIZE = canvas.width / GRID_SIZE;

// Variáveis de estado do jogo
let snake = [];
let direction = { x: 0, y: 0 };
let food = {};
let gameRunning = false;
let score = 0;
let gameState = 'start'; // Estados: 'start', 'playing', 'gameOver', 'win'

// Inicializar estado do jogo
function initGame() {
    // Iniciar cobra com tamanho maior para mais diversão
    snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 },
        { x: 10, y: 13 },
        { x: 10, y: 14 },
        { x: 10, y: 15 }
    ];
    direction = { x: 0, y: -1 }; // Iniciar movendo para cima
    generateFood();
    gameRunning = true;
    score = 6; // Tamanho inicial
    gameState = 'playing';
    gameLoop();
}

// Gerar posição aleatória da comida
function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// Loop principal do jogo
function gameLoop() {
    if (!gameRunning) return;

    moveSnake();
    checkCollisions();
    checkWinCondition();
    draw();
    setTimeout(gameLoop, 150); // Velocidade do jogo
}

// Mover cobra baseada na direção atual
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Verificar se comida foi comida
    if (head.x === food.x && head.y === food.y) {
        score--;
        generateFood();
        // No snake reverso, comer comida encolhe a cobra, então removemos um segmento extra
        snake.pop();
        snake.pop(); // Remover dois segmentos para encolher
    } else {
        snake.pop(); // Movimento normal, remover cauda
    }
}

// Verificar colisões com paredes ou consigo mesma
function checkCollisions() {
    const head = snake[0];

    // Colisão com parede
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOver('Colisão com parede!');
        return;
    }

    // Colisão consigo mesma
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver('Colisão consigo mesma!');
            return;
        }
    }
}

// Verificar se jogador venceu (cobra desapareceu)
function checkWinCondition() {
    if (score <= 0) {
        gameRunning = false;
        gameState = 'win';
        // Não reiniciar automaticamente
    }
}

// Função de fim de jogo
function gameOver(message) {
    gameRunning = false;
    gameState = 'gameOver';
    // Não reiniciar automaticamente
}

// Renderizar jogo no canvas
function draw() {
    // Limpar canvas
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'start') {
        // Mostrar mensagem de início com hierarquia visual
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = '32px monospace'; // Título maior
        ctx.fillText('BEM-VINDO AO', canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillText('REVERSE SNAKE', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '16px monospace'; // Instrução menor
        ctx.fillText('PRESSIONE START OU ENTER', canvas.width / 2, canvas.height / 2 + 30);
        ctx.fillText('PARA INICIAR', canvas.width / 2, canvas.height / 2 + 50);
        ctx.textAlign = 'left';
        return;
    }

    if (gameState === 'gameOver') {
        // Mostrar mensagem de fim de jogo
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = '32px monospace'; // Título maior
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '16px monospace'; // Instrução menor
        ctx.fillText('PRESSIONE RESTART PARA', canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('JOGAR NOVAMENTE', canvas.width / 2, canvas.height / 2 + 40);
        ctx.textAlign = 'left';
        return;
    }

    if (gameState === 'win') {
        // Mostrar mensagem de vitória
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = '32px monospace'; // Título maior
        ctx.fillText('VOCE GANHOU!!', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '16px monospace'; // Instrução menor
        ctx.fillText('PRESSIONE RESTART PARA', canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('JOGAR NOVAMENTE', canvas.width / 2, canvas.height / 2 + 40);
        ctx.textAlign = 'left';
        return;
    }

    // Desenhar cobra
    ctx.fillStyle = '#2c3e50';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

    // Desenhar comida
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * TILE_SIZE, food.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // Desenhar pontuação
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px monospace';
    ctx.fillText(`TAMANHO: ${score}`, 10, 30);
}

// Lidar com entrada do teclado
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        if (gameState === 'start') {
            initGame();
        } else if (gameState === 'gameOver' || gameState === 'win') {
            resetGame();
        }
        return;
    }

    if (!gameRunning) return;

    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Lidar com entrada de toque para mobile
document.getElementById('up').addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameRunning && direction.y === 0) direction = { x: 0, y: -1 };
});
document.getElementById('up').addEventListener('click', () => {
    if (gameRunning && direction.y === 0) direction = { x: 0, y: -1 };
});
document.getElementById('down').addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameRunning && direction.y === 0) direction = { x: 0, y: 1 };
});
document.getElementById('down').addEventListener('click', () => {
    if (gameRunning && direction.y === 0) direction = { x: 0, y: 1 };
});
document.getElementById('left').addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameRunning && direction.x === 0) direction = { x: -1, y: 0 };
});
document.getElementById('left').addEventListener('click', () => {
    if (gameRunning && direction.x === 0) direction = { x: -1, y: 0 };
});
document.getElementById('right').addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameRunning && direction.x === 0) direction = { x: 1, y: 0 };
});
document.getElementById('right').addEventListener('click', () => {
    if (gameRunning && direction.x === 0) direction = { x: 1, y: 0 };
});

// Lidar com botão start para mobile
document.getElementById('start').addEventListener('click', () => {
    if (gameState === 'start') {
        initGame();
    }
});

// Lidar com botão restart para mobile
document.getElementById('restart').addEventListener('click', () => {
    if (gameState === 'gameOver' || gameState === 'win') {
        resetGame();
    }
});

// Função para reiniciar o jogo
function resetGame() {
    gameState = 'start';
    gameRunning = false;
    snake = [];
    direction = { x: 0, y: 0 };
    food = {};
    score = 0;
    draw(); // Redesenhar para mostrar a tela de início
}

// Iniciar jogo no carregamento da página - mostrar tela inicial
draw(); // Mostrar a tela de início
