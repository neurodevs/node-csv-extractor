import fs from 'fs'
import csvParser from 'csv-parser'

export default class CsvExtractorImpl implements CsvExtractor {
    public static Class?: CsvExtractorConstructor

    protected csvPath: string
    protected csvData: CsvData

    protected constructor(csvPath: string, csvData: CsvData) {
        this.csvPath = csvPath
        this.csvData = csvData
    }

    public static async Create(csvPath: string) {
        this.assertOptions(csvPath)

        const csvData = await this.loadCsvData(csvPath).catch((error) => {
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

    protected static async loadCsvData(csvPath: string): Promise<CsvData> {
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
        const result: Record<string, any> = {}

        rules.forEach((rule) => {
            const matchingRow = this.csvData.find(
                (row) => row[rule.column] === rule.value
            )
            if (matchingRow) {
                result[rule.value] = matchingRow[rule.extract]
            }
        })

        return result
    }
}

export interface CsvExtractor {
    extract(rules: ExtractionRule[]): ExtractedResult
}

export interface ExtractionRule {
    column: string
    value: string
    extract: string
}

export type ExtractedResult = Record<string, any>

export type CsvExtractorConstructor = new (
    csvPath: string,
    csvData: CsvData
) => CsvExtractor

export type CsvData = CsvRow[]

export type CsvRow = Record<string, string | number | boolean>
