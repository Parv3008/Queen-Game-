let gridSize = 5; 
let gridMap = new Map();

let R= "R";
let B = "B";
let G = "G";
let O = "O";
let P = "P";

let regions = [
    [R, R, B, B, B],
    [R, R, B, B, B],
    [O, P, P, B, B],
    [O, P, P, G, G],
    [O, O, O, G, G]
];

for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        let key = row + "," + col;
        gridMap.set(key, { region: regions[row][col], star: false });
    }
}

function printGrid() {
    for (let row = 0; row < gridSize; row++) {
        let line = ""; // Store row as a string
        for (let col = 0; col < gridSize; col++) {
            let key = row + "," + col;
            let cell = gridMap.get(key);
            line += " " + cell.region + " "; // Print region number
        }
        console.log(line); // Print row
    }
}

// Call the function to print the grid
printGrid();

function isValidPlacement(row, col) {
    let key = row + "," + col;
    let region = gridMap.get(key).region;
    
    let regionHasStar = false;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let checkKey = i + "," + j;
            let cell = gridMap.get(checkKey);

            if (cell.star === true) {
                
                if (i === row || j === col) {
                    return false; 
                }

                if (cell.region === region) {
                    regionHasStar = true;
                }
   
                if ((i === row - 1 && j === col-1) || // Above
                    (i === row + 1 && j === col+1) || // Below
                    (i === row+1 && j === col - 1) || // Left
                    (i === row-1 && j === col + 1)) { // Right
                    return false;
                }
            }
        }
    }

    if (regionHasStar) {
        return false;
    }
    return true;
}

function placeStar(row, col) {
    let key = row + "," + col;
    if (isValidPlacement(row, col)) {
        gridMap.get(key).star = true;
        console.log("Star placed at (" + row + "," + col + ")");
    } else {
        console.log("Invalid placement at (" + row + "," + col + ")");
    }
}

placeStar(0, 0); 
placeStar(2, 2); 
placeStar(4, 1); 
placeStar(1, 3); 
placeStar(3, 4); 




