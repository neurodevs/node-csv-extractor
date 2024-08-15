export interface CsvExtractor {
    extract(rules: ExtractionRule[]): ExtractedRecord
}

export interface ExtractionRule {
    column: string
    value: string
    extract: string
}

export type ExtractedRecord = Record<string, string>

export type CsvExtractorConstructor = new (
    csvPath: string,
    csvData: CsvData
) => CsvExtractor

export type CsvData = CsvRow[]

export type CsvRow = Record<string, string>
