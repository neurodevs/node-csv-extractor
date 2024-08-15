import CsvExtractorImpl from '../CsvExtractor'
import { CsvData } from '../types'

export default class SpyCsvExtractor extends CsvExtractorImpl {
    public static shouldThrow = false

    public constructor(csvPath: string, csvData: CsvData) {
        super(csvPath, csvData)
    }
}
