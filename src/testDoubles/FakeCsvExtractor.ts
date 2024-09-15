import { CsvRow } from '@neurodevs/node-csv-loader'
import { CsvExtractor, ExtractedRecord, ExtractionRule } from '../CsvExtractor'

export default class FakeCsvExtractor implements CsvExtractor {
    public static fakedRecord?: ExtractedRecord

    public path: string
    public data: CsvRow[]
    public passedRules: ExtractionRule[][] = []
    private fakedRecord: ExtractedRecord = {}

    public constructor(csvPath: string, csvData: CsvRow[]) {
        this.path = csvPath
        this.data = csvData
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
