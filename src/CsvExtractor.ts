import fs from 'fs'
import csvParser from 'csv-parser'

export default class CsvExtractorImpl implements CsvExtractor {
    public static Class?: CsvExtractorConstructor

    protected csvPath: string
    protected csvData: Record<string, any>

    protected constructor(csvPath: string, csvData: Record<string, any>) {
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

    protected static async loadCsvData(csvPath: string) {
        return new Promise((resolve, reject) => {
            const data: any[] = []
            fs.createReadStream(csvPath)
                .pipe(csvParser())
                .on('data', (row) => data.push(row))
                .on('end', () => resolve(data))
                .on('error', (err) => reject(err))
        }) as Promise<Record<string, any>>
    }
}

export interface CsvExtractor {}

export type CsvExtractorConstructor = new (
    csvPath: string,
    csvData: Record<string, any>
) => CsvExtractor
