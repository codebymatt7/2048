const board = document.getElementById('board');
const scoreDisplay = document.getElementById('score');
const gameMessage = document.getElementById('game-message');
const restartButton = document.getElementById('restart');

let score = 0;
let tiles = [];

function initializeGame() {
    // Create 4x4 grid
    tiles = Array(4).fill().map(() => Array(4).fill(null));
    addNewTile();
    addNewTile();
    updateBoard();
}

function addNewTile() {
    let emptyCells = [];
    tiles.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
            if (cell === null) emptyCells.push([rIndex, cIndex]);
        });
    });
    if (emptyCells.length === 0) return;
    let [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    tiles[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
    board.innerHTML = '';
    tiles.forEach(row => {
        row.forEach(value => {
            const tileDiv = document.createElement('div');
            tileDiv.classList.add('tile');
            if (value) {
                tileDiv.classList.add(`tile-${value}`);
                tileDiv.textContent = value;
            }
            board.appendChild(tileDiv);
        });
    });
    scoreDisplay.textContent = score;
    checkGameOver();
}

function move(direction) {
    let moved = false;
    // Movement logic depending on direction
    for (let i = 0; i < 4; i++) {
        let line = tiles[i].filter(t => t !== null);
        if (direction === 'up' || direction === 'down') line = tiles.map(row => row[i]).filter(t => t !== null);
        if (direction === 'right' || direction === 'down') line.reverse();

        for (let j = 0; j < line.length - 1; j++) {
            if (line[j] === line[j + 1]) {
                line[j] *= 2;
                score += line[j];
                line.splice(j + 1, 1);
                line.push(null);
                moved = true;
            }
        }

        if (direction === 'right' || direction === 'down') line.reverse();
        if (direction === 'up' || direction === 'down') tiles.forEach((row, index) => row[i] = line[index] || null);
        else tiles[i] = line.concat(Array(4 - line.length).fill(null));
    }
    if (moved) addNewTile();
    updateBoard();
}

function checkGameOver() {
    if (tiles.flat().includes(null)) return;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if ((i > 0 && tiles[i][j] === tiles[i - 1][j]) || (j > 0 && tiles[i][j] === tiles[i][j - 1])) return;
        }
    }
    gameMessage.classList.add('active');
    gameMessage.querySelector('p').textContent = 'Game Over!';
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
    }
});

restartButton.addEventListener('click', () => {
    score = 0;
    initializeGame();
    gameMessage.classList.remove('active');
});

initializeGame();
