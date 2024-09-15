import { CsvRow } from '@neurodevs/node-csv-loader'
import CsvExtractorImpl from '../CsvExtractor'

export default class SpyCsvExtractor extends CsvExtractorImpl {
    public static shouldThrow = false

    public constructor(csvPath: string, csvData: CsvRow[]) {
        super(csvPath, csvData)
    }
}
