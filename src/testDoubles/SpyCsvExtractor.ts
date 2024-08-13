import CsvExtractorImpl from '../__tests__/behavioral/CsvExtractor'

export class SpyCsvExtractor extends CsvExtractorImpl {
    public constructor(csvPath: string) {
        super(csvPath)
    }

    public getCsvPath() {
        return this.csvPath
    }
}
