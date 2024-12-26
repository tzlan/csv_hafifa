/**
 * Fonction pour lire un fichier CSV et le convertir en tableau d'objets.
 * @param filePath Chemin du fichier CSV.
 * @returns Données du CSV parsées sous forme de tableau d'objets.
 */
export declare function readCSV(filePath: string): Promise<any[]>;
/**
 * Fonction pour paginer un tableau en morceaux plus petits.
 * @param data Tableau d'objets à paginer.
 * @param pageSize Nombre d'éléments par page.
 * @returns Un tableau contenant des pages (chacune étant un tableau d'objets).
 */
export declare function paginate(data: any[], pageSize: number): any[][];
/**
 * fonction pour sauvegarder chaque page dans un fichier CSV séparé
 * @param pages tableau de pages (chacune étant un tableau d'objets)
 * @param outputDir dossier ou je sauvegarde mes fichiers
 */
export declare function savePagesAsCSV(pages: any[][], outputDir: string): void;
/**
 * Fonction de tri des données par colonne et ordre (ascendant ou descendant).
 * @param data Tableau d'objets à trier.
 * @param columnIndex Index de la colonne à trier.
 * @param order Ordre du tri ('asc' ou 'desc').
 * @returns Tableau trié.
 */
export declare function sortData(data: any[], columnIndex: number, order: 'asc' | 'desc'): any[];
/**
 * Filtre les données selon une colonne et une condition donnée.
 * @param data Tableau d'objets à filtrer.
 * @param columnIndex Index de la colonne à utiliser pour le filtrage.
 * @param condition Condition de filtrage ('equal', 'less', 'greater', 'isIn').
 * @param filterValue Valeur ou tableau de valeurs pour le filtrage.
 * @returns Tableau filtré.
 */
export declare function filterData(data: any[], columnIndex: number, condition: 'equal' | 'less' | 'greater' | 'isIn', filterValue: string | number | (string | number)[]): any[];
/**
 * Fonction principale pour traiter les questions courantes (tri, filtrage, etc.) sur le CSV.
 */
export declare function processCSV(filePath: string): Promise<void>;
