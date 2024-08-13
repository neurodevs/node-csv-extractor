export default class CsvExtractorImpl implements CsvExtractor {
    public static Class?: CsvExtractorConstructor

    //@ts-ignore
    private csvPath: string

    protected constructor(csvPath: string) {
        this.csvPath = csvPath
    }

    public static Create(csvPath: string) {
        this.assertOptions(csvPath)
        return new (this.Class ?? this)(csvPath)
    }

    protected static assertOptions(csvPath: string) {
        if (!csvPath) {
            throw new Error('Missing required options: csvPath!')
        }
    }
}

export interface CsvExtractor {}

export type CsvExtractorConstructor = new () => CsvExtractor
