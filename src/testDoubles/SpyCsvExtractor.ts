import CsvExtractorImpl, { CsvData } from '../CsvExtractor'

export class SpyCsvExtractor extends CsvExtractorImpl {
    public static shouldThrow = false

    public constructor(csvPath: string, csvData: CsvData) {
        super(csvPath, csvData)
    }

    public getCsvPath() {
        return this.csvPath
    }

    public getCsvData() {
        return this.csvData
    }
}
