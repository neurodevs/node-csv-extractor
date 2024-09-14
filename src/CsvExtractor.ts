import fs from 'fs'
import csvParser from 'csv-parser'
import {
    CsvData,
    CsvExtractor,
    CsvExtractorConstructor,
    CsvRow,
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
        this.assertOptions(csvPath)

        const csvData = await this.loadCsv(csvPath).catch((error) => {
            throw new Error(
                `LOAD_CSV_FAILED: "${csvPath}"!\n\nOriginal error:\n\n${error}`
            )
        })

        return new (this.Class ?? this)(csvPath, csvData)
    }

    protected static assertOptions(csvPath: string) {
        if (!csvPath) {
            throw new Error('MISSING_REQUIRED_OPTIONS: csvPath!')
        }
        if (!fs.existsSync(csvPath)) {
            throw new Error(`FILE_NOT_FOUND: "${csvPath}"!`)
        }
    }

    protected static async loadCsv(csvPath: string): Promise<CsvData> {
        return await new Promise((resolve, reject) => {
            const data: CsvData = []

            fs.createReadStream(csvPath)
                .pipe(csvParser())
                .on('data', (row: CsvRow) => data.push(row))
                .on('end', () => resolve(data))
                .on('error', (err) => reject(err))
        })
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
