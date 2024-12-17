export function stringsToRowsSplitter (strings: string[], joiner: string, maxChars: number): string [][] {
    if (strings.length === 0) {
        return [];
    }

    if (strings.length === 1 || strings.join(joiner).length <= maxChars) {
        return [strings];
    }

    const result: string[][] = [];
    let currentRow: string[] = [];
    let currentRowLength = 0;
    for (const string of strings) {
        if (currentRowLength + string.length + joiner.length > maxChars) {
            result.push(currentRow);
            currentRow = [];
            currentRowLength = 0;
        }
        currentRow.push(string);
        currentRowLength += string.length + joiner.length;
    }
    result.push(currentRow);
    return result;
}
