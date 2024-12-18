export function chunkEvenly<T> (array: T[], size: number): T[][] {
    const numColumns = Math.ceil(array.length / size);
    const columns: T[][] = Array.from({length: numColumns}, () => []);

    array.forEach((item, index) => {
        columns[index % numColumns].push(item);
    });

    return columns;
}
