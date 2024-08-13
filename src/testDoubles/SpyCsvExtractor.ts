import CsvExtractorImpl from '../CsvExtractor'

export class SpyCsvExtractor extends CsvExtractorImpl {
    public constructor(csvPath: string, csvData: Record<string, any>) {
        super(csvPath, csvData)
    }

    public getCsvPath() {
        return this.csvPath
    }

    public getCsvData() {
        return this.csvData
    }
}
