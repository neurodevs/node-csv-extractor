export interface CsvExtractor {
    extract(rules: ExtractionRule[]): ExtractedResult
}

export interface ExtractionRule {
    column: string
    value: string
    extract: string
}

export type ExtractedResult = Record<string, any>

export type CsvExtractorConstructor = new (
    csvPath: string,
    csvData: CsvData
) => CsvExtractor

export type CsvData = CsvRow[]

export type CsvRow = Record<string, string | number | boolean>
