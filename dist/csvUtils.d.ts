/**
 * Reads a CSV file and returns its content as an array of objects.
 * @param filePath Path to the CSV file.
 * @returns Parsed CSV data as an array of objects.
 */
export declare function readCSV(filePath: string): Promise<any[]>;
/**
 * Paginates data into smaller chunks of a specified size.
 * @param data Array of objects to paginate.
 * @param pageSize Number of items per page.
 * @returns Array of pages (each page is an array of objects).
 */
export declare function paginate(data: any[], pageSize: number): any[][];
/**
 * Writes paginated data to separate CSV files.
 * @param pages Array of pages (each page is an array of objects).
 * @param outputDir Directory to save the files.
 */
export declare function savePagesAsCSV(pages: any[][], outputDir: string): void;
/**
 * Sorts the data by a specific column and order (ascending or descending) using Bubble Sort.
 * @param data Array of objects to sort.
 * @param columnIndex Index of the column to sort by (0-based).
 * @param order Sorting order ('asc' for ascending, 'desc' for descending).
 * @returns Sorted array of objects.
 */
export declare function sortData(data: any[], columnIndex: number, order: 'asc' | 'desc'): any[];
/**
 * Filters data based on a column and condition.
 * @param data Array of objects to filter.
 * @param columnIndex Index of the column to filter by (0-based).
 * @param condition Filtering condition ('equal', 'less', 'greater', 'isIn').
 * @param filterValue Value or array of values to filter against.
 * @returns Filtered data array.
 */
export declare function filterData(data: any[], columnIndex: number, condition: 'equal' | 'less' | 'greater' | 'isIn', filterValue: string | number | (string | number)[]): any[];
