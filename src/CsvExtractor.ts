import { assertOptions } from '@sprucelabs/schema'
import { CsvLoaderImpl } from '@neurodevs/node-csv-loader'
import {
    CsvData,
    CsvExtractor,
    CsvExtractorConstructor,
    ExtractedRecord,
    ExtractionRule,
} from './types'

export default class CsvExtractorImpl implements CsvExtractor {
    public static Class?: CsvExtractorConstructor

    public csvPath: string
    public csvData: CsvData

    protected constructor(csvPath: string, csvData: CsvData) {
        this.csvPath = csvPath
        this.csvData = csvData
    }

    public static async Create(csvPath: string) {
        assertOptions({ csvPath }, ['csvPath'])

        const loader = CsvLoaderImpl.Create({ shouldValidatePath: false })
        const csvData = await loader.load(csvPath)

        return new (this.Class ?? this)(csvPath, csvData)
    }

    public extract(rules: ExtractionRule[]) {
        return this.applyRules(rules)
    }

    private applyRules(rules: ExtractionRule[]) {
        const record: ExtractedRecord = {}

        rules.forEach((rule) => {
            const matchingRow = this.findMatchingRow(rule)

            if (matchingRow) {
                const { value, extract } = rule

                const extractedValue = matchingRow[extract]
                const numericValue = Number(extractedValue)

                record[value] = isNaN(numericValue)
                    ? extractedValue
                    : numericValue
            }
        })

        return record
    }

    private findMatchingRow(rule: ExtractionRule) {
        const { column, value } = rule
        return this.csvData.find((row) => row[column] === value)
    }
}
