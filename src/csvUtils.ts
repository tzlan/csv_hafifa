import fs from 'fs';
import Papa from 'papaparse';

/**
 * Reads a CSV file and returns its content as an array of objects.
 * @param filePath Path to the CSV file.
 * @returns Parsed CSV data as an array of objects.
 */
export async function readCSV(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        Papa.parse(fileContent, {
            header: true, // Parse the CSV with headers
            skipEmptyLines: true, // Skip empty lines
            complete: (result) => resolve(result.data), // Resolve with parsed data
            error: (error: Error) => reject(error), // Reject on error with explicit type
        });
    });
}
