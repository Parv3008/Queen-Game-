function startGame() {
    let gridSize = parseInt(document.getElementById("gridSize").value);
    const solution = generateQueens(gridSize);
    const board = solution.map(row => row.split(''));
    console.log(solution);
    let regions = assignQueenColors(board, gridSize);
    regions = fillBoardRegions(regions, board, gridSize);
    createGrid(gridSize, regions);
    document.getElementById("message").textContent = "";
}

function createGrid(gridSize, regions) {
    const gridContainer = document.getElementById("grid");
    gridContainer.innerHTML = "";
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;
    let queenPositions = new Map();
    let regionQueens = new Map(); 

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("div");
            cell.classList.add("grid-item");
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (regions[row][col]) {
                cell.style.backgroundColor = regions[row][col];
            }

            cell.addEventListener("click", function handleQueenClick(event) {
                const cell = event.target;
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                const regionColor = regions[row][col];

                if (cell.textContent === "👑") {
                    cell.textContent = "";
                    queenPositions.delete(`${row},${col}`);
                    regionQueens.delete(regionColor); 
                    document.getElementById("message").textContent = "";
                    return;
                }

                if (regionQueens.has(regionColor)) {
                    let originalColor = cell.style.backgroundColor;
                    cell.style.backgroundColor = "red";
                    setTimeout(() => {
                        cell.style.backgroundColor = originalColor;
                    }, 500);
                    return;
                }

                if (isSafe(queenPositions, row, col, gridSize)) {
                    cell.textContent = "👑";
                    queenPositions.set(`${row},${col}`, 'Q');
                    regionQueens.set(regionColor, { row, col });          
                } else {
                    let originalColor = cell.style.backgroundColor;
                    cell.style.backgroundColor = "red";
                    setTimeout(() => {
                        cell.style.backgroundColor = originalColor;
                    }, 500);
                }

                if (queenPositions.size === gridSize) {
                    message.textContent = "🎉 Awesome! You placed all the queens correctly! 🎉";
                    message.style.color = "green";
                }
            });

            gridContainer.appendChild(cell);
        }
    }
}

//this function check if queen is place in safe position
//it will check condotion for horizontally, vertically, left diagonal and right diagonal
function isSafe(queenPositions, row, col, n) {
    for (let j = 0; j < n; j++) {
        if (queenPositions.get(`${row},${j}`) === 'Q') return false;
    }
    for (let i = 0; i < n; i++) {
        if (queenPositions.get(`${i},${col}`) === 'Q') return false;
    }

    let directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (let [dx, dy] of directions) {
        let newRow = row + dx;
        let newCol = col + dy;
        if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
            if (queenPositions.get(`${newRow},${newCol}`) === 'Q') return false;
        }
    }

    return true;
}

//this function tries to place queens while checking if the position is safe or not 
function tryPlacingQueens(queenPositions, n) {
    let availableCols = new Set([...Array(n).keys()]);
    for (let row = 0; row < n; row++) {
        let cols = Array.from(availableCols);
        if (cols.length === 0) return false;
        let col = cols[Math.floor(Math.random() * cols.length)];        //pick  a random column for place queen
        if (!isSafe(queenPositions, row, col, n)) return false;
        queenPositions.set(`${row},${col}`, 'Q');
        availableCols.delete(col);      // here i delete the column which is used 
    }
    return true;
}

//this function generate random solution
function generateQueens(n) {
    let queenPositions = new Map();
    while (!tryPlacingQueens(queenPositions, n)) {
        queenPositions = new Map();
    }
    let board = Array.from({ length: n }, () => Array(n).fill('-'));
    for (let [key, value] of queenPositions.entries()) {
        if (value === 'Q') {
            let [row, col] = key.split(',').map(Number);
            board[row][col] = 'Q';
        }
    }
    return board.map(row => row.join(''));
}

//this function assign a color to each queen 
function assignQueenColors(board, n) {
    let regions = Array.from({ length: n }, () => Array(n).fill(null));
    let colors = ['green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'cyan', 'magenta'];
    let colorIndex = 0;

    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            if (board[row][col] === 'Q') {
                regions[row][col] = colors[colorIndex % colors.length];
                colorIndex++;
            }
        }
    }
    return regions;
}

//after assigning color to queen, now we want available cells to fill the remaining cells
//this function will return the available cells
function findEmptyCells(regions, n) {
    let emptyCells = [];
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            if (!regions[row][col]) {
                emptyCells.push({ row, col });
            }
        }
    }
    return emptyCells;
}

//this function will pick a random cell from available cells
function selectRandomCell(emptyCells) {
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells.splice(randomIndex, 1)[0];        //this will remove the cell from available cells and return the selected cell
}

//this function will get the color of the near cells
function getNearbyColors(regions, row, col, n) {
    let nearbyColors = new Set();
    let directions = [[1, 0], [-1, 0], [0, -1], [0, 1]];
    for (let [x, y] of directions) {
        let newRow = row + x;
        let newCol = col + y;
        if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n && regions[newRow][newCol]) {
            nearbyColors.add(regions[newRow][newCol]);
        }
    }
    return nearbyColors;
}

//this function will assign color to the cell
function assignCellColor(regions, row, col, nearbyColors) {
    if (nearbyColors.size > 0) {
        let colors = Array.from(nearbyColors);
        regions[row][col] = colors[Math.floor(Math.random() * colors.length)];
    }
}

//this function will fill the remaining cells with color
function fillBoardRegions(regions, board, n) {
    let emptyCells = findEmptyCells(regions, n);
    while (emptyCells.length > 0) {
        let cell = selectRandomCell(emptyCells);
        let nearbyColors = getNearbyColors(regions, cell.row, cell.col, n);
        if (nearbyColors.size === 0) {
            emptyCells.push(cell);
            continue;
        }
        assignCellColor(regions, cell.row, cell.col, nearbyColors);
    }

//this will clear the queen from the board bez we want to place the queen otherwise it will show the queen on the board
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            if (board[row][col] === 'Q') {
                board[row][col] = '-';
            }
        }
    }

    return regions;
}
