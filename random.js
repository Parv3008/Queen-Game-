function isSafe(map, row, col, n) {

    // Check horizontally
    for (let j = 0; j < n; j++) {
        if (map.get(`${row},${j}`) === 'Q') {
            return false;
        }
    }

    // Check vertically  
    for (let i = 0; i < n; i++) {
        if (map.get(`${i},${col}`) === 'Q') {
            return false;
        }
    }

    // Check left diagonal 
    let i = row - 1, j = col - 1;
    if (i >= 0 && j >= 0) {
        if (map.get(`${i},${j}`) === 'Q') {
            return false;
        }
    }

    // Check right diagonal 
    i = row - 1, j = col + 1;
    if (i >= 0 && j < n) {
        if (map.get(`${i},${j}`) === 'Q') {
            return false;
        }
    }

    return true;
}

function solveNQueensDirect(map, n) {
    let availableCols = new Set([...Array(n).keys()]); // Store available columns

    for (let row = 0; row < n; row++) {
        let cols = Array.from(availableCols);
        let col = cols[Math.floor(Math.random() * cols.length)]; // Pick a random column

        if (!isSafe(map, row, col, n)) return false; // If not safe, return failure
        
        map.set(`${row},${col}`, 'Q'); // Place the queen
        availableCols.delete(col); // Remove used column
    }
    return true;
}

function getRandomNQueensSolution(n) {
    let map = new Map(); 

    while (!solveNQueensDirect(map, n)) {
        map = new Map(); // Reset and try again
    }

    // Convert Map to Board format
    let board = Array.from({ length: n }, () => Array(n).fill('-'));
    for (let [key, value] of map.entries()) {
        if (value === 'Q') {
            let [row, col] = key.split(',').map(Number);
            board[row][col] = 'Q';
        }
    }

    return board.map(row => row.join('')); // Convert board to string format
}



function QueenColor(board,n){
    let regions = Array.from({ length: n }, () => Array(n).fill(null));
    
    let color = ["🔴","🟠","🟡","🟢","🔵","🟣"];
    let queenPosition = [];
    let colorIndex = 0;
    
    for(let row=0; row<n; row++){
        for(let col=0; col<n; col++){
            if(board[row][col] === 'Q'){
                regions[row][col] = color[colorIndex];
                queenPosition.push([row,col,colorIndex]);
                colorIndex++;
            }
        }
    }
    return { colors: color, queenPositions: queenPosition, regions };
}

// let n = 5;
// let solution = getRandomNQueensSolution(n);
// console.log("Generated N-Queens Solution:");
// console.log(solution.join("\n")); // Print board row by row

// let result = QueenColor(solution, n);

// console.log("\nRegions with Assigned Colors:");
// console.log(result.regions.map(row => row.join(' - ')).join('\n'));

//Identify Available Empty Cells
function getAvailableCells(regions,n){
    let AvailableCells = [];

    for (let row=0; row<n ; row++){
        for (let col=0; col<n; col++){
            if (!regions[row][col]){
                AvailableCells.push([row,col]);
            }           
        }
    }
    return AvailableCells;
}

//Pick a Random Empty Cell
function pickRandomCell(availableCells){
    let randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells.splice(randomIndex,1)[0];
}

//Get Neighbor Colors
function getNearColor(regions,row,col,n){
    let nearcolor = new Set();
    let directions = [[1,0],[-1,0],[0,-1],[0,1]];
    for (let [dx,dy] of directions){
        let newrow = row + dx;
        let newcol = col + dy;
        if (newrow >=0 && newrow < n && newcol >=0 && newcol < n && regions[newrow][newcol]){
            nearcolor.add(regions[newrow][newcol]);
        }
    }
    return nearcolor;
}

//Assign a Color to the Cell
function assignColor(regions,row,col,nearcolor){
    if(nearcolor.size > 0){
        let randomColor = Array.from(nearcolor)[Math.floor(Math.random() * nearcolor.size)];
        regions[row][col] = randomColor;
    }
}


function fillRegions(regions, n){
    let availableCells = getAvailableCells(regions,n);

    while(availableCells.length > 0){
        let {row,col} = pickRandomCell(availableCells);
        let nearcolor = getNearColor(regions,row,col,n);
        assignColor(regions,row,col,nearcolor);
    }
    return regions; 
}

function displayBoard(board) {
    console.log("\nGenerated N-Queens Board:");
    console.log(board.map(row => row.join(" ")).join("\n"));
}

function displayRegions(regions) {
    console.log("\nGenerated Regions:");
    console.log(regions.map(row => row.join(" ")).join("\n"));
}

let n = 5; // Define grid size



// Generate a valid N-Queens solution
let solution = getRandomNQueensSolution(n);

// Assign unique colors to each queen and initialize the region map
let result = QueenColor(solution, n);

// Fill the empty regions with expanded colors
let finalRegions = fillRegions(result.regions, n);

// Display the board and final regions
displayBoard(solution);
displayRegions(finalRegions);
