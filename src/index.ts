import { readCSV, paginate, savePagesAsCSV, sortData, filterData } from './csvUtils';

async function main() {
    try {
        
        // Lire les arguments de la ligne de commande
        const args = process.argv.slice(2);
        let pageSize = 5; // Valeur par défaut
        let columnIndex = 0; // Index de la colonne pour trier ou filtrer
        let sortOrder: 'asc' | 'desc' = 'asc'; // Ordre de tri par défaut
        let filterValue: string | number | (string | number)[] = ''; // Valeur pour filtrer
        let filterCondition: 'equal' | 'less' | 'greater' | 'isIn' = 'equal'; // Condition de filtrage

        // Récupérer les paramètres de la ligne de commande
        args.forEach((arg, index) => {
            if (arg === '--pageSize' && args[index + 1]) {
                pageSize = parseInt(args[index + 1], 10);
            }
            if (arg === '--sortColumn' && args[index + 1]) {
                columnIndex = parseInt(args[index + 1], 10);
            }
            if (arg === '--sortOrder' && args[index + 1]) {
                sortOrder = args[index + 1] as 'asc' | 'desc';
            }
            if (arg === '--filter' && args[index + 1]) {
                const value = args[index + 1];
                filterValue = value.includes(',') ? value.split(',') : isNaN(Number(value)) ? value : Number(value);
            }
            if (arg === '--filterCondition' && args[index + 1]) {
                filterCondition = args[index + 1] as 'equal' | 'less' | 'greater' | 'isIn';
            }
        });

        // Vérifier que pageSize est valide
        if (isNaN(pageSize) || pageSize < 2 || pageSize > 50) {
            console.error('Page size must be a number between 2 and 50.');
            process.exit(1);
        }

        console.log(`Using page size: ${pageSize}`);
        console.log(`Sorting data by column ${columnIndex} in ${sortOrder} order.`);
        console.log(`Filtering data by column ${columnIndex} with value: ${filterValue} and condition: ${filterCondition}`);

        const filePath = './data/data.csv';
        const outputDir = './dist/pagination';

        // Lire le CSV
        const data = await readCSV(filePath);
        console.log(`Loaded ${data.length} rows.`);

        // Appliquer le tri
        const sortedData = sortData(data, columnIndex, sortOrder);
        console.log(`Data sorted by column ${columnIndex} in ${sortOrder} order.`);

        // Appliquer le filtrage si nécessaire
        let filteredData = sortedData;
        if (filterValue) {
            filteredData = filterData(sortedData, columnIndex, filterCondition, filterValue);
            console.log(`Filtered data by column ${columnIndex} with condition: ${filterCondition} and value: ${filterValue}.`);
        }

        // Paginer les données
        const pages = paginate(filteredData, pageSize);
        console.log(`Data paginated into ${pages.length} pages.`);

        // Sauvegarder chaque page dans un fichier CSV
        savePagesAsCSV(pages, outputDir);
        console.log('Pagination complete!');
    } catch (error) {
        console.error('Error:', error);
    }

}

main();
