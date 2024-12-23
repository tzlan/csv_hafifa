"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCSV = readCSV;
const fs_1 = __importDefault(require("fs"));
const papaparse_1 = __importDefault(require("papaparse"));
/**
 * Reads a CSV file and returns its content as an array of objects.
 * @param filePath Path to the CSV file.
 * @returns Parsed CSV data as an array of objects.
 */
async function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
        papaparse_1.default.parse(fileContent, {
            header: true, // Parse the CSV with headers
            skipEmptyLines: true, // Skip empty lines
            complete: (result) => resolve(result.data), // Resolve with parsed data
            error: (error) => reject(error), // Reject on error with explicit type
        });
    });
}
