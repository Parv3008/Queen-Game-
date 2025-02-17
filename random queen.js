import readline from 'readline-sync';

//this function check if queen is place in safe position
//it will check condotion for horizontally, vertically, left diagonal and right diagonal
function isSafe(map, row, col, n) {
    // Check for horizontal
    for (let j = 0; j < n; j++) {
        if (map.get(`${row},${j}`) === 'Q') {
            return false;
        }
    }

    // Check for vertical
    for (let i = 0; i < n; i++) {
        if (map.get(`${i},${col}`) === 'Q') {
            return false;
        }
    }

    // Check for left diagonal 
    let i = row - 1, j = col - 1;
    while (i >= 0 && j >= 0) {
        if (map.get(`${i},${j}`) === 'Q') {
            return false;
        }
        i--;
        j--;
    }

    // Check for right diagonal 
    i = row - 1, j = col + 1;
    while (i >= 0 && j < n) {
        if (map.get(`${i},${j}`) === 'Q') {
            return false;
        }
        i--;
        j++;
    }

    return true;
}

//this function is convert the board array to map object
function convertBoardToMap(board, n) {
    let map = new Map();
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            if (board[row][col] === 'Q') {
                map.set(`${row},${col}`, 'Q');
            }
        }
    }
    return map;
}

//this function tries to place queens while checking if the position is safe or not 
function placeQueen(map, n) {
    let availableCols = new Set([...Array(n).keys()]);   //so i used set to store the available columns

    for (let row = 0; row < n; row++) {
        let cols = Array.from(availableCols);
        if (cols.length === 0) return false;
        let col = cols[Math.floor(Math.random() * cols.length)];   //pick  a random column for place queen

        if (!isSafe(map, row, col, n)) return false;
        
        map.set(`${row},${col}`, 'Q');
        availableCols.delete(col);      // here i delete the column which is used 
    }
    return true;
}

//this function generate random solution
function randomQueen(n) {
    let map = new Map(); 

    while (!placeQueen(map, n)) {   //this is keep trying until we get the solution
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
    let color = ["🔴","🟣","🟡","🟢","🔵","🟠"];
    let colorIndex = 0;
    
    for(let row = 0; row < n; row++) {
        for(let col = 0; col < n; col++) {
            if(board[row][col] === 'Q') {
                regions[row][col] = color[colorIndex];    //assign color to queen
                colorIndex++;
            }
        }
    }
    return { regions };
}

//after assigning color to queen, now we want available cells to fill the remaining cells
//this function will return the available cells
function AvailableCells(regions, n) {
    let availableCells = [];
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            if (!regions[row][col]) {
                availableCells.push({ row, col });   //store empty cell position
            }           
        }
    }
    return availableCells;
}

//this function will pick a random cell from available cells
function pickRandomCell(availableCells) {
    let randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells.splice(randomIndex, 1)[0];   //this will remove the cell from available cells and return the selected cell
}

//this function will get the color of the near cells
function getNearColor(regions, row, col, n) {
    let nearColor = new Set();
    let directions = [[1,0], [-1,0], [0,-1], [0,1]];    //this is the direction to check the near cells
    for (let [x, y] of directions) {
        let newRow = row + x;
        let newCol = col + y;
        if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n && regions[newRow][newCol]) {
            nearColor.add(regions[newRow][newCol]);     //store the color of near cells
        }
    }
    return nearColor;
}

//this function will assign color to the cell
function assignColor(regions, row, col, nearColor) {
    if (nearColor.size > 0) {
        let colors = Array.from(nearColor);
        regions[row][col] = colors[Math.floor(Math.random() * colors.length)];   //// Pick a random color from near cell
    }
}

//this function will fill the remaining cells with color
function fillRegions(regions, n) {
    let availableCells = AvailableCells(regions, n);

    while (availableCells.length > 0) {     //this will keep filling the cells until all cells are filled
        let cell = pickRandomCell(availableCells);
        let nearColor = getNearColor(regions, cell.row, cell.col, n);
        if (nearColor.size === 0) {
            availableCells.push(cell);
            continue;
        }
        assignColor(regions, cell.row, cell.col, nearColor);
    }
    return regions;
}   

//this function print solution and take user input to place the queen
function main() {
    const n = 5; 
    const solution = randomQueen(n);
    console.log("Generated Queen Solution:");       //print the solution
    solution.forEach(row => console.log(row));

    const board = solution.map(row => row.split(''));
    const { regions } = QueenColor(board, n);
    fillRegions(regions, n);

    //this will clear the queen from the board bez we want to place the queen otherwise it will show the queen on the board
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            if (board[row][col] === 'Q') {
                board[row][col] = '-';
            }
        }
    }

    console.log("\nColored Regions:");   //print the colored regions
    regions.forEach(row => console.log(row.join('')));

    // Take user input for placing queens
    for (let i = 0; i < n; i++) {
        let isValidPosition = false;
        while (!isValidPosition) {
            const userInput = readline.question(`Enter position ${i + 1} (row,col) to place the queen: `);
            const [row, col] = userInput.split(',').map(Number);

            const map = convertBoardToMap(board, n);
            if (isSafe(map, row, col, n)) {     //check if the position is safe or not
                board[row][col] = 'Q';
                console.log(`Queen placed at position (${row}, ${col})`);
                isValidPosition = true;
            } else {
                console.log(`Invalid position (${row}, ${col}). Please enter a valid position.`);
            }
        }
    }

    console.log("\n\n👑👑👑👑👑👑👑👑👑👑👑 congratulation you win 👑👑👑👑👑👑👑👑👑👑👑");
    console.log("\nFinal Board:");
    board.forEach(row => console.log(row.join('')));
}

main();