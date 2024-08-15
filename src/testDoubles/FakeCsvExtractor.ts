import {
    CsvExtractor,
    ExtractionRule,
    ExtractedRecord,
    CsvData,
} from '../types'

export default class FakeCsvExtractor implements CsvExtractor {
    public static fakedRecord?: ExtractedRecord

    public csvPath: string
    public csvData: CsvData
    public passedRules: ExtractionRule[][] = []
    private fakedRecord: ExtractedRecord = {}

    public constructor(csvPath: string, csvData: CsvData) {
        this.csvPath = csvPath
        this.csvData = csvData
    }

    public extract(rules: ExtractionRule[]) {
        this.passedRules.push(rules)
        return FakeCsvExtractor.fakedRecord ?? this.fakedRecord
    }

    public setFakeRecord(record: ExtractedRecord) {
        delete FakeCsvExtractor.fakedRecord
        this.fakedRecord = record
    }
}
