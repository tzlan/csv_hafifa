import { readCSV } from './csvUtils';

async function main() {
    try {
        const filePath = './data/data.csv'; // Chemin du fichier CSV
        const data = await readCSV(filePath);
        console.log(data); // Affiche les données dans le terminal
    } catch (error) {
        console.error('Error reading CSV file:', error);
    }
}

main();
