import {primMaze} from "./src/primMaze.js";

function toString(cells, width, height) {
    let string = "";
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const contains = cells.filter((point) => point.row == row && point.col == col).length != 0;
            string = string + (contains ? "." : "#");
        }
        string = string + "\n";
    }

    return string;
}

let cells = primMaze(23, 23);
console.log(toString(cells, 23, 23));
