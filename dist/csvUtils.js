"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCSV = readCSV;
exports.paginate = paginate;
exports.savePagesAsCSV = savePagesAsCSV;
exports.sortData = sortData;
exports.filterData = filterData;
exports.processCSV = processCSV;
var fs_1 = require("fs");
var papaparse_1 = require("papaparse");
/**Juste lire le fichier CSV et le convertir en tableau d'objets
ts-node src/index.ts --action "read-csv" --file "./data/data.csv"

Utiliser paginate
ts-node index.ts --action "paginate" --file "./data/data.csv" --pageSize 3

Tri
ts-node index.ts --action "sort" --file "./data/data.csv" --column 2 --order "asc"

Filtrer
ts-node index.ts --action "sort" --file "./data/data.csv" --column 2 --order "asc"

Tri filtrage et pagination
ts-node index.ts --action "full-process" --file "./data/data.csv" --pageSize 3 --sortColumn 2 --sortOrder "asc" --filterColumn 3 --filterCondition "equal" --filterValue "Rifle"


ts-node src/index.ts --pageSize 2 --sortColumn 4 --sortOrder desc --filter "Drone" --filterCondition equal
ts-node src/index.ts --action "read-csv" --file "data.csv" --limit 5
ts-node src/index.ts --action "sort" --file "data.csv" --column "unit_cost" --order "asc" # ou "desc"
ts-node src/index.ts --action "sort" --file "data.csv" --column "type" --order "asc"
ts-node src/index.ts --action "filter" --file "data.csv" --column "type" --condition "equal" --value "bomb"
ts-node src/index.ts --action "filter" --file "data.csv" --column "range" --condition "greater" --value 500

*/
/**
 * Fonction pour lire un fichier CSV et le convertir en tableau d'objets.
 * @param filePath Chemin du fichier CSV.
 * @returns Données du CSV parsées sous forme de tableau d'objets.
 */
function readCSV(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    // Lecture du fichier CSV en tant que texte
                    var fileContent = fs_1.default.readFileSync(filePath, 'utf8');
                    // Utilisation de PapaParse pour convertir le texte en JSON
                    papaparse_1.default.parse(fileContent, {
                        header: true, // Considérer la première ligne comme en-tête
                        skipEmptyLines: true, // Ignorer les lignes vides
                        complete: function (result) { return resolve(result.data); }, // Résultat en cas de succès
                        error: function (error) { return reject(error); }, // Gestion des erreurs
                    });
                })];
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
    var numberOfPages = Math.ceil(data.length / pageSize);
    /**  je divise le nombre total d'éléments par le nombre d'éléments par page
    * le résultat de la division vers le haut pour inclure une
    * page supplémentaire si des lignes restent
    *
    * si le tableau contient 11 éléments et que la taille de la page est 5 genre 11/5 = 3
    */
    var pages = [];
    //je crée les pages 
    for (var i = 0; i < numberOfPages; i++) {
        var start = i * pageSize;
        var end = Math.min(start + pageSize, data.length);
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
    pages.forEach(function (page, index) {
        // Convertir une page en contenu CSV
        var csvContent = papaparse_1.default.unparse(page);
        var fileName = "".concat(outputDir, "/page-").concat(index + 1, ".csv"); // juste le blaze du fichier
        fs_1.default.writeFileSync(fileName, csvContent); //  le contenu du fichier
        console.log("Page ".concat(index + 1, " saved to ").concat(fileName));
    });
}
/**
 * Fonction de tri des données par colonne et ordre (ascendant ou descendant)
 * @param data tableau que je rentre en param a trier
 * @param columnIndex Index de la colonne à trier
 * @param order Ordre du tri ('asc' ou 'desc')
 * @returns Tableau trié
 
 */
function sortData(data, columnIndex, order) {
    var _a;
    var n = data.length;
    //Basic Tri a bulles
    for (var i = 0; i < n - 1; i++) {
        var swapped = false;
        for (var j = 0; j < n - 1 - i; j++) {
            var valueA = data[j][columnIndex];
            var valueB = data[j + 1][columnIndex];
            var shouldSwap = false;
            // Convertir les chaînes en nombres au cas
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
                _a = [data[j + 1], data[j]], data[j] = _a[0], data[j + 1] = _a[1];
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
function filterData(data, // Tableau d'objets à filtrer
columnIndex, // Index de la colonne à utiliser pour le filtrage
condition, // Condition de filtrage
filterValue // Valeur ou tableau de valeurs pour le filtrage
) {
    // Utilise la méthode filter pour créer un nouveau tableau avec les éléments qui passent le test
    return data.filter(function (row) {
        // Récupère la valeur de la colonne spécifiée dans la ligne actuelle
        var columnValue = Object.values(row)[columnIndex];
        // Si la valeur de la colonne est indéfinie ou nulle, exclut la ligne
        if (columnValue === undefined || columnValue === null)
            return false;
        // Convertit filterValue en nombre si c'est une chaîne de caractères
        var numericFilterValue = typeof filterValue === 'string' ? parseFloat(filterValue) : filterValue;
        // Vérification selon la condition
        switch (condition) {
            case 'equal':
                // Vérifie si la valeur de la colonne est égale à filterValue
                return columnValue == filterValue;
            case 'less':
                // Vérifie si la valeur de la colonne est inférieure à filterValue (pour les nombres)
                return typeof columnValue === 'number' && typeof numericFilterValue === 'number' && columnValue < numericFilterValue;
            case 'greater':
                // Vérifie si la valeur de la colonne est supérieure à filterValue (pour les nombres)
                return typeof columnValue === 'number' && typeof numericFilterValue === 'number' && columnValue > numericFilterValue;
            case 'isIn':
                // Vérifie si la valeur de la colonne est dans le tableau filterValue
                if (Array.isArray(filterValue)) {
                    return filterValue.some(function (value) { return value === columnValue; });
                }
                return false;
            default:
                // Lance une erreur si la condition est inconnue
                throw new Error("Unknown filtering condition: ".concat(condition));
        }
    });
}
/**
 * Fonction principale pour traiter les questions courantes (tri, filtrage, etc.) sur le CSV.
 */
function processCSV(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var data, limitedData, sortedByUnitCost, sortedByType, bombsOnly, rangeMoreThan500, northernAirBase;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readCSV(filePath)];
                case 1:
                    data = _a.sent();
                    limitedData = paginate(data, 5)[0];
                    console.log('First 5 lines:', limitedData);
                    sortedByUnitCost = sortData(__spreadArray([], data, true), 2, 'desc');
                    console.log('Sorted by unit cost (desc):', sortedByUnitCost);
                    sortedByType = sortData(__spreadArray([], data, true), 3, 'asc');
                    console.log('Sorted by type (asc):', sortedByType);
                    bombsOnly = filterData(data, 3, 'equal', 'Bomb');
                    console.log('Bombs only:', bombsOnly);
                    rangeMoreThan500 = filterData(data, 4, 'greater', 500);
                    console.log('Range > 500 km:', rangeMoreThan500);
                    northernAirBase = filterData(data, 5, 'equal', 'Northern Air Base');
                    console.log('Armament located in Northern Air Base:', northernAirBase);
                    return [2 /*return*/];
            }
        });
    });
}
