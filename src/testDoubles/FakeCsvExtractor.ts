import {
    CsvExtractor,
    ExtractionRule,
    ExtractedRecord,
    CsvData,
} from '../types'

export default class FakeCsvExtractor implements CsvExtractor {
    public csvPath: string
    public csvData: CsvData
    public wasExtractCalled = false
    public extractCalledWith: ExtractionRule[][] = []
    private fakedRecord: ExtractedRecord = {}

    public constructor(csvPath: string, csvData: CsvData) {
        this.csvPath = csvPath
        this.csvData = csvData
    }

    public extract(rules: ExtractionRule[]) {
        this.wasExtractCalled = true
        this.extractCalledWith.push(rules)
        return this.fakedRecord
    }

    public fakeRecord(record: ExtractedRecord) {
        this.fakedRecord = record
    }
}
