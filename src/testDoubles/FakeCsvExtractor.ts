import {
    CsvExtractor,
    ExtractionRule,
    ExtractedRecord,
    CsvData,
} from '../types'

export default class FakeCsvExtractor implements CsvExtractor {
    public csvPath: string
    public csvData: CsvData
    public passedRules?: ExtractionRule[]
    private fakedRecord: ExtractedRecord = {}

    public constructor(csvPath: string, csvData: CsvData) {
        this.csvPath = csvPath
        this.csvData = csvData
    }

    public extract(rules: ExtractionRule[]) {
        this.passedRules = rules
        return this.fakedRecord
    }

    public setFakeRecord(record: ExtractedRecord) {
        this.fakedRecord = record
    }
}
