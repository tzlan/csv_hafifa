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
const fs_1 = __importDefault(require("fs"));
const papaparse_1 = __importDefault(require("papaparse"));
/**
 * Reads a CSV file and returns its content as an array of objects.
 * @param filePath Path to the CSV file.
 * @returns Parsed CSV data as an array of objects.
 */
async function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const fileContent = fs_1.default.readFileSync(filePath, 'utf8'); // Lecture du fichier
        papaparse_1.default.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => resolve(result.data),
            error: (error) => reject(error),
        });
    });
}
/**
 * Paginates data into smaller chunks of a specified size.
 * @param data Array of objects to paginate.
 * @param pageSize Number of items per page.
 * @returns Array of pages (each page is an array of objects).
 */
function paginate(data, pageSize) {
    // Vérification de la validité de pageSize
    if (!Number.isInteger(pageSize) || pageSize < 2 || pageSize > 50) {
        throw new Error('Page size must be an integer between 2 and 50.');
    }
    // Calcul du nombre de pages, en utilisant Math.ceil pour garantir que toutes les lignes sont couvertes
    const numberOfPages = Math.ceil(data.length / pageSize);
    console.log(`Data paginated into ${numberOfPages} pages.`);
    const pages = [];
    for (let i = 0; i < numberOfPages; i++) {
        const start = i * pageSize; // Calcul de l'index de départ pour la page
        const end = Math.min(start + pageSize, data.length); // On s'assure que l'on ne dépasse pas la longueur des données
        pages.push(data.slice(start, end)); // Découpe les données de la page
    }
    return pages;
}
/**
 * Writes paginated data to separate CSV files.
 * @param pages Array of pages (each page is an array of objects).
 * @param outputDir Directory to save the files.
 */
function savePagesAsCSV(pages, outputDir) {
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir); // Création du répertoire si nécessaire
    }
    pages.forEach((page, index) => {
        const csvContent = papaparse_1.default.unparse(page);
        const fileName = `${outputDir}/page-${index + 1}.csv`;
        fs_1.default.writeFileSync(fileName, csvContent);
        console.log(`Page ${index + 1} saved to ${fileName}`);
    });
}
/**
 * Sorts the data by a specific column and order (ascending or descending) using Bubble Sort.
 * @param data Array of objects to sort.
 * @param columnIndex Index of the column to sort by (0-based).
 * @param order Sorting order ('asc' for ascending, 'desc' for descending).
 * @returns Sorted array of objects.
 */
function sortData(data, columnIndex, order) {
    const n = data.length;
    console.log('Before sorting:', data);
    // Implémentation du tri à bulles
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            const valueA = data[j][columnIndex];
            const valueB = data[j + 1][columnIndex];
            let shouldSwap = false;
            // Comparaison en fonction de l'ordre et des types
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                shouldSwap = order === 'asc' ? valueA.localeCompare(valueB) > 0 : valueA.localeCompare(valueB) < 0;
            }
            else if (typeof valueA === 'number' && typeof valueB === 'number') {
                shouldSwap = order === 'asc' ? valueA > valueB : valueA < valueB;
            }
            if (shouldSwap) {
                // Échanger les éléments
                [data[j], data[j + 1]] = [data[j + 1], data[j]];
                swapped = true;
            }
        }
        // Si aucun échange n'a eu lieu, les données sont déjà triées
        if (!swapped)
            break;
    }
    // Tri
    console.log('After sorting:', data);
    return data;
}
/**
 * Filters data based on a column and condition.
 * @param data Array of objects to filter.
 * @param columnIndex Index of the column to filter by (0-based).
 * @param condition Filtering condition ('equal', 'less', 'greater', 'isIn').
 * @param filterValue Value or array of values to filter against.
 * @returns Filtered data array.
 */
function filterData(data, columnIndex, condition, filterValue) {
    return data.filter(row => {
        const columnValue = Object.values(row)[columnIndex];
        // Assurer que la colonne est bien définie
        if (columnValue === undefined || columnValue === null)
            return false;
        // Si filterValue est une chaîne de caractères ou un nombre, on traite comme tel
        const numericFilterValue = typeof filterValue === 'string' ? parseFloat(filterValue) : filterValue;
        switch (condition) {
            case 'equal':
                return columnValue == filterValue;
            case 'less':
                // Vérifier que columnValue et filterValue sont des nombres avant de comparer
                return typeof columnValue === 'number' && typeof numericFilterValue === 'number' && columnValue < numericFilterValue;
            case 'greater':
                // Vérifier que columnValue et filterValue sont des nombres avant de comparer
                return typeof columnValue === 'number' && typeof numericFilterValue === 'number' && columnValue > numericFilterValue;
            case 'isIn':
                // Vérifier si filterValue est un tableau
                if (Array.isArray(filterValue)) {
                    // Vérifier que columnValue est une valeur primitive (ni objet, ni tableau)
                    if (columnValue !== null && typeof columnValue !== 'object') {
                        // Assurez-vous que columnValue est bien comparable avec les valeurs dans filterValue
                        return filterValue.some(value => value === columnValue);
                    }
                    // Si columnValue est un objet ou un tableau, on ne le compare pas avec filterValue
                    return false;
                }
                return false;
            default:
                throw new Error(`Unknown filtering condition: ${condition}`);
        }
    });
}
