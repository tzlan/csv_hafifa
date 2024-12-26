"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCSV = readCSV;
exports.paginate = paginate;
exports.savePagesAsCSV = savePagesAsCSV;
exports.sortData = sortData;
exports.filterData = filterData;
exports.processCSV = processCSV;
const fs_1 = __importDefault(require("fs"));
const papaparse_1 = __importDefault(require("papaparse"));
//ts-node index.ts --action "read-csv" --file "data.csv" --limit 5
//ts-node index.ts --action "sort" --file "data.csv" --column "unit_cost" --order "asc" # ou "desc"
//ts-node index.ts --action "sort" --file "data.csv" --column "type" --order "asc"
//ts-node index.ts --action "filter" --file "data.csv" --column "type" --condition "equal" --value "bomb"
//ts-node index.ts --action "filter" --file "data.csv" --column "range" --condition "greater" --value 500
/**
 * Fonction pour lire un fichier CSV et le convertir en tableau d'objets.
 * @param filePath Chemin du fichier CSV.
 * @returns Données du CSV parsées sous forme de tableau d'objets.
 */
async function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        // Lecture du fichier CSV en tant que texte
        const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
        // Utilisation de PapaParse pour convertir le texte en JSON
        papaparse_1.default.parse(fileContent, {
            header: true, // Considérer la première ligne comme en-tête
            skipEmptyLines: true, // Ignorer les lignes vides
            complete: (result) => resolve(result.data), // Résultat en cas de succès
            error: (error) => reject(error), // Gestion des erreurs
        });
    });
}
/**
 * Fonction pour paginer un tableau en morceaux plus petits.
 * @param data Tableau d'objets à paginer.
 * @param pageSize Nombre d'éléments par page.
 * @returns Un tableau contenant des pages (chacune étant un tableau d'objets).
 */
function paginate(data, pageSize) {
    if (!Number.isInteger(pageSize) || pageSize < 2 || pageSize > 50) {
        throw new Error('Page size must be an integer between 2 and 50.');
    }
    // calcule du nombre total de pages
    const numberOfPages = Math.ceil(data.length / pageSize);
    /**  je divise le nombre total d'éléments par le nombre d'éléments par page
    * le résultat de la division vers le haut pour inclure une
    * page supplémentaire si des lignes restent
    *
    * si le tableau contient 11 éléments et que la taille de la page est 5 genre 11/5 = 3
    */
    const pages = [];
    //je crée les pages 
    for (let i = 0; i < numberOfPages; i++) {
        const start = i * pageSize;
        const end = Math.min(start + pageSize, data.length);
        // Ajouter une tranche de données à la page
        pages.push(data.slice(start, end));
    }
    return pages;
}
/**
 * fonction pour sauvegarder chaque page dans un fichier CSV séparé
 * @param pages tableau de pages (chacune étant un tableau d'objets)
 * @param outputDir dossier ou je sauvegarde mes fichiers
 */
function savePagesAsCSV(pages, outputDir) {
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir); // Créer le dossier s'il n'existe pas
    }
    pages.forEach((page, index) => {
        // Convertir une page en contenu CSV
        const csvContent = papaparse_1.default.unparse(page);
        const fileName = `${outputDir}/page-${index + 1}.cspv`; // Nom du fichier
        fs_1.default.writeFileSync(fileName, csvContent); // Écrire le contenu dans le fichier
        console.log(`Page ${index + 1} saved to ${fileName}`);
    });
}
/**
 * Fonction de tri des données par colonne et ordre (ascendant ou descendant).
 * @param data Tableau d'objets à trier.
 * @param columnIndex Index de la colonne à trier.
 * @param order Ordre du tri ('asc' ou 'desc').
 * @returns Tableau trié.
 */
function sortData(data, columnIndex, order) {
    const n = data.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            let valueA = data[j][columnIndex];
            let valueB = data[j + 1][columnIndex];
            let shouldSwap = false;
            // Convertir les chaînes en nombres si possible
            if (typeof valueA === 'string' && !isNaN(parseFloat(valueA))) {
                valueA = parseFloat(valueA);
            }
            if (typeof valueB === 'string' && !isNaN(parseFloat(valueB))) {
                valueB = parseFloat(valueB);
            }
            // Comparaison selon le type des valeurs et l'ordre demandé
            if (typeof valueA === 'number' && typeof valueB === 'number') {
                shouldSwap = order === 'asc' ? valueA > valueB : valueA < valueB;
            }
            else if (typeof valueA === 'string' && typeof valueB === 'string') {
                shouldSwap = order === 'asc' ? valueA.localeCompare(valueB) > 0 : valueA.localeCompare(valueB) < 0;
            }
            // Échange des valeurs si nécessaire
            if (shouldSwap) {
                [data[j], data[j + 1]] = [data[j + 1], data[j]];
                swapped = true;
            }
        }
        if (!swapped)
            break; // Arrêt si plus d'échange nécessaire
    }
    return data;
}
/**
 * Filtre les données selon une colonne et une condition donnée.
 * @param data Tableau d'objets à filtrer.
 * @param columnIndex Index de la colonne à utiliser pour le filtrage.
 * @param condition Condition de filtrage ('equal', 'less', 'greater', 'isIn').
 * @param filterValue Valeur ou tableau de valeurs pour le filtrage.
 * @returns Tableau filtré.
 */
function filterData(data, columnIndex, condition, filterValue) {
    return data.filter(row => {
        const columnValue = Object.values(row)[columnIndex];
        if (columnValue === undefined || columnValue === null)
            return false;
        const numericFilterValue = typeof filterValue === 'string' ? parseFloat(filterValue) : filterValue;
        // Vérification selon la condition
        switch (condition) {
            case 'equal':
                return columnValue == filterValue;
            case 'less':
                return typeof columnValue === 'number' && typeof numericFilterValue === 'number' && columnValue < numericFilterValue;
            case 'greater':
                return typeof columnValue === 'number' && typeof numericFilterValue === 'number' && columnValue > numericFilterValue;
            case 'isIn':
                if (Array.isArray(filterValue)) {
                    return filterValue.some(value => value === columnValue);
                }
                return false;
            default:
                throw new Error(`Unknown filtering condition: ${condition}`);
        }
    });
}
/**
 * Fonction principale pour traiter les questions courantes (tri, filtrage, etc.) sur le CSV.
 */
async function processCSV(filePath) {
    const data = await readCSV(filePath);
    // Retourner un maximum de 5 lignes
    const limitedData = paginate(data, 5)[0];
    console.log('First 5 lines:', limitedData);
    // Tri par coût unitaire (descendant)
    const sortedByUnitCost = sortData([...data], 2, 'desc');
    console.log('Sorted by unit cost (desc):', sortedByUnitCost);
    // Tri par type (ascendant)
    const sortedByType = sortData([...data], 3, 'asc');
    console.log('Sorted by type (asc):', sortedByType);
    // Filtrer uniquement les bombes
    const bombsOnly = filterData(data, 3, 'equal', 'Bomb');
    console.log('Bombs only:', bombsOnly);
    // Filtrer pour un rayon > 500 km
    const rangeMoreThan500 = filterData(data, 4, 'greater', 500);
    console.log('Range > 500 km:', rangeMoreThan500);
    // Bonus : Filtrer les armements situés à la base aérienne du nord
    const northernAirBase = filterData(data, 5, 'equal', 'Northern Air Base');
    console.log('Armament located in Northern Air Base:', northernAirBase);
}
