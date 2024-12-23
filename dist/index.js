"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csvUtils_1 = require("./csvUtils");
async function main() {
    try {
        const filePath = './data/data.csv'; // Chemin du fichier CSV
        const data = await (0, csvUtils_1.readCSV)(filePath);
        console.log(data); // Affiche les données dans le terminal
    }
    catch (error) {
        console.error('Error reading CSV file:', error);
    }
}
main();
