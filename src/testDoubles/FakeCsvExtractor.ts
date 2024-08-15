import {
    CsvExtractor,
    ExtractionRule,
    ExtractedResult,
    CsvData,
} from '../types'

export default class FakeCsvExtractor implements CsvExtractor {
    public csvPath: string
    public csvData: CsvData
    public wasExtractCalled = false
    public extractCalledWith: ExtractionRule[][] = []

    public constructor(csvPath: string, csvData: CsvData) {
        this.csvPath = csvPath
        this.csvData = csvData
    }

    public extract(rules: ExtractionRule[]) {
        this.wasExtractCalled = true
        this.extractCalledWith.push(rules)
        return {} as ExtractedResult
    }
}
