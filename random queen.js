function startGame() {
    let gridSize = parseInt(document.getElementById("gridSize").value);
    const solution = randomQueen(gridSize);
    const board = solution.map(row => row.split(''));
    console.log(solution);
    let regions = QueenColor(board, gridSize);
    regions = fillRegions(regions, board, gridSize);
    generateGrid(gridSize, regions);
}

function generateGrid(gridSize, regions) {
    const gridContainer = document.getElementById("grid");
    gridContainer.innerHTML = "";
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;
    let queenInGrid = new Map();
    let queenInRegions = new Map(); 

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("div");
            cell.classList.add("grid-item");
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (regions[row][col]) {
                cell.style.backgroundColor = regions[row][col];
            }

            cell.addEventListener("click", function isQueen(event) {
                const cell = event.target;
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                const regionColor = regions[row][col];

                // cell.addEventListener("click", function isQueen(event) {
                //     const cell = event.target;
                //     if (cell.textContent === "👑") {
                //         cell.textContent = "";
                //     } else {
                //         cell.textContent = "👑";
                //     }
                // });

                if (cell.textContent === "👑") {
                    cell.textContent = "";
                    queenInGrid.delete(`${row},${col}`);
                    queenInRegions.delete(regionColor); 
                    return;
                }

                if (queenInRegions.has(regionColor)) {
                    let originalColor = cell.style.backgroundColor;
                    cell.style.backgroundColor = "red";
                    setTimeout(() => {
                        cell.style.backgroundColor = originalColor;
                    }, 500);
                    return;
                }

                if (isSafe(queenInGrid, row, col, gridSize, regions)) {
                    cell.textContent = "👑";
                    queenInGrid.set(`${row},${col}`, 'Q');
                    queenInRegions.set(regionColor, { row, col });          
                } else {
                    let originalColor = cell.style.backgroundColor;
                    cell.style.backgroundColor = "red";
                    setTimeout(() => {
                        cell.style.backgroundColor = originalColor;
                        
                    }, 500);
                }

                if (queenInGrid.size === gridSize) {
                    message.textContent = "🎉 Congratulations! All queens are placed correctly 🎉";
                    message.style.color = "green";
                    setTimeout(() => {
                        message.innerHTML = ""
                    },10000);
                }
            });

            gridContainer.appendChild(cell);
        }
    }
}

//this function check if queen is place in safe position
//it will check condotion for horizontally, vertically, left diagonal and right diagonal
function isSafe(map, row, col, n) {
    // Check row and column
    for (let j = 0; j < n; j++) {
        if (map.get(`${row},${j}`) === 'Q') return false;
    }
    for (let i = 0; i < n; i++) {
        if (map.get(`${i},${col}`) === 'Q') return false;
    }

    // Check only the closest diagonal queens not whole diagonal
    let directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (let [dx, dy] of directions) {
        let newRow = row + dx;
        let newCol = col + dy;
        if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
            if (map.get(`${newRow},${newCol}`) === 'Q') return false;
        }
    }

    return true;
}

//this function tries to place queens while checking if the position is safe or not 
function placeQueen(map, n) {
    let availableCols = new Set([...Array(n).keys()]);           //so i used set to store the available columns
    for (let row = 0; row < n; row++) {
        let cols = Array.from(availableCols);
        if (cols.length === 0) return false;
        let col = cols[Math.floor(Math.random() * cols.length)];     //pick  a random column for place queen
        if (!isSafe(map, row, col, n)) return false;
        map.set(`${row},${col}`, 'Q');
        availableCols.delete(col);              // here i delete the column which is used 
    }
    return true;
}

//this function generate random solution
function randomQueen(n) {
    let map = new Map();
    while (!placeQueen(map, n)) {           //this is keep trying until we get the solution
        map = new Map();
    }
    let board = Array.from({ length: n }, () => Array(n).fill('-'));
    for (let [key, value] of map.entries()) {
        if (value === 'Q') {
            let [row, col] = key.split(',').map(Number);
            board[row][col] = 'Q';
        }
    }
    return board.map(row => row.join(''));
}

//this function assign a color to each queen 
function QueenColor(board, n) {
    let regions = Array.from({ length: n }, () => Array(n).fill(null));
    let colors = ['green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'cyan', 'magenta'];
    let colorIndex = 0;

    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            if (board[row][col] === 'Q') {
                regions[row][col] = colors[colorIndex % colors.length];         //assign color to queen
                colorIndex++;
            }
        }
    }
    return  regions ;
}

//after assigning color to queen, now we want available cells to fill the remaining cells
//this function will return the available cells
function AvailableCells(regions, n) {
    let availableCells = [];
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            if (!regions[row][col]) {
                availableCells.push({ row, col });          //store empty cell position
            }
        }
    }
    return availableCells;
}

//this function will pick a random cell from available cells
function pickRandomCell(availableCells) {
    let randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells.splice(randomIndex, 1)[0];            //this will remove the cell from available cells and return the selected cell
}

//this function will get the color of the near cells
function getNearColor(regions, row, col, n) {
    let nearColor = new Set();
    let directions = [[1, 0], [-1, 0], [0, -1], [0, 1]];    //this is the direction to check the near cells
    for (let [x, y] of directions) {
        let newRow = row + x;
        let newCol = col + y;
        if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n && regions[newRow][newCol]) {
            nearColor.add(regions[newRow][newCol]);         //store the color of near cells
        }
    }
    return nearColor;
}

//this function will assign color to the cell
function assignColor(regions, row, col, nearColor) {
    if (nearColor.size > 0) {
        let colors = Array.from(nearColor);
        regions[row][col] = colors[Math.floor(Math.random() * colors.length)];      // Pick a random color from near cell
    }
}

//this function will fill the remaining cells with color
function fillRegions(regions, board, n) {
    let availableCells = AvailableCells(regions, n);
    while (availableCells.length > 0) {         //this will keep filling the cells until all cells are filled
        let cell = pickRandomCell(availableCells);
        let nearColor = getNearColor(regions, cell.row, cell.col, n);
        if (nearColor.size === 0) {
            availableCells.push(cell);
            continue;
        }
        assignColor(regions, cell.row, cell.col, nearColor);
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
