import CsvExtractorImpl from '../CsvExtractor'

export class SpyCsvExtractor extends CsvExtractorImpl {
    public constructor(csvPath: string) {
        super(csvPath)
    }

    public getCsvPath() {
        return this.csvPath
    }
}
