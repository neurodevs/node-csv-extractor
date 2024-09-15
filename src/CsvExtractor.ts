import { assertOptions } from '@sprucelabs/schema'
import { CsvLoaderImpl, CsvRow } from '@neurodevs/node-csv-loader'

export default class CsvExtractorImpl implements CsvExtractor {
    public static Class?: CsvExtractorConstructor

    public path: string
    public data: CsvRow[]

    protected constructor(path: string, data: CsvRow[]) {
        this.path = path
        this.data = data
    }

    public static async Create(path: string) {
        assertOptions({ path }, ['path'])

        const loader = CsvLoaderImpl.Create({ shouldValidatePath: false })
        const csvData = await loader.load(path)

        return new (this.Class ?? this)(path, csvData)
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
        return this.data.find((row: CsvRow) => row[column] === value)
    }
}

export interface CsvExtractor {
    path: string
    data: CsvRow[]
    extract(rules: ExtractionRule[]): ExtractedRecord
}

export type CsvExtractorConstructor = new (
    path: string,
    data: CsvRow[]
) => CsvExtractor

export interface ExtractionRule {
    column: string
    value: string
    extract: string
}

export type ExtractedRecord = Record<string, string | number>
