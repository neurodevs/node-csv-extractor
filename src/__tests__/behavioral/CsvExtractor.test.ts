import fs from 'fs'
import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import csvParser from 'csv-parser'
import CsvExtractorImpl, { CsvData, ExtractionRule } from '../../CsvExtractor'
import { SpyCsvExtractor } from '../../testDoubles/SpyCsvExtractor'

export default class CsvExtractorTest extends AbstractSpruceTest {
    // @ts-ignore
    private static assertOptions = CsvExtractorImpl.assertOptions
    // @ts-ignore
    private static loadCsvData = CsvExtractorImpl.loadCsvData

    private static testCsvData: CsvData
    private static csvPath: string
    private static dummyExtractor: SpyCsvExtractor

    private static readonly testCsvPath = 'src/__tests__/testData/test.csv'

    protected static async beforeEach() {
        await super.beforeEach()

        this.setTestDouble()
        this.fakeMethods()

        this.testCsvData = await this.loadCsv(this.testCsvPath)

        this.csvPath = generateId()
        this.dummyExtractor = await this.CsvExtractor()
    }

    @test()
    protected static async canCreateCsvExtractor() {
        assert.isTruthy(this.dummyExtractor)
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        this.clearFakeMethods()

        await assert.doesThrowAsync(
            async () => await this.CsvExtractor(''),
            this.optionsError
        )
    }

    @test()
    protected static async throwsIfCsvPathDoesNotExist() {
        this.clearFakeMethods()

        const csvPath = generateId()
        const errorMatcher = `${this.fileNotFoundError}: "${csvPath}"!`

        await assert.doesThrowAsync(
            async () => await this.CsvExtractor(csvPath),
            errorMatcher
        )
    }

    @test()
    protected static async throwsIfLoadCsvFails() {
        SpyCsvExtractor.shouldThrow = true

        const errorMatcher = `LOAD_CSV_FAILED: "${this.csvPath}"!`

        await assert.doesThrowAsync(
            async () => await this.CsvExtractor(),
            errorMatcher
        )
    }

    @test()
    protected static async usesProvidedCsvPath() {
        const csvPath = this.dummyExtractor.getCsvPath()
        assert.isEqual(csvPath, this.csvPath)
    }

    @test()
    protected static async loadsCsvDataOnCreate() {
        this.clearFakeMethods()

        const extractor = await this.CsvExtractor(this.testCsvPath)
        const csvData = extractor.getCsvData()

        assert.isEqualDeep(csvData, this.testCsvData)
    }

    @test()
    protected static async extractReturnsCsvDataWithNoRules() {
        const csvData = this.dummyExtractor.extract([])
        assert.isEqualDeep(csvData, this.dummyExtractor.getCsvData())
    }

    @test('extractReturnsCorrectRow: column_3', 3)
    @test('extractReturnsCorrectColumn: column_2', 2)
    @test('extractReturnsCorrectColumn: column_1', 1)
    protected static async extractReturnsCorrectColumn(columnNum: number) {
        this.clearFakeMethods()

        const realExtractor = await this.CsvExtractor(this.testCsvPath)

        const rules: ExtractionRule[] = [
            {
                column: `column_${columnNum}`,
                value: `${columnNum}`,
            },
        ]

        const csvData = realExtractor.extract(rules)
        assert.isEqualDeep(csvData, realExtractor.getCsvData().slice(0, 1))
    }

    private static async loadCsv(csvPath: string) {
        return new Promise((resolve, reject) => {
            const data: any[] = []
            fs.createReadStream(csvPath)
                .pipe(csvParser())
                .on('data', (row) => data.push(row))
                .on('end', () => resolve(data))
                .on('error', (err) => reject(err))
        }) as Promise<CsvData>
    }

    private static readonly optionsError = 'MISSING_REQUIRED_OPTIONS: csvPath!'

    private static readonly fileNotFoundError = 'FILE_NOT_FOUND'

    private static setTestDouble() {
        CsvExtractorImpl.Class = SpyCsvExtractor
        SpyCsvExtractor.shouldThrow = false
    }

    private static fakeMethods() {
        // @ts-ignore
        CsvExtractorImpl.assertOptions = (_csvPath: string) => {}
        // @ts-ignore
        CsvExtractorImpl.loadCsvData = async (_csvPath: string) => {
            if (SpyCsvExtractor.shouldThrow) {
                throw new Error('Fake error!')
            }
        }
    }

    private static clearFakeMethods() {
        // @ts-ignore
        CsvExtractorImpl.assertOptions = this.assertOptions
        // @ts-ignore
        CsvExtractorImpl.loadCsvData = this.loadCsvData
    }

    private static async CsvExtractor(csvPath?: string) {
        return (await CsvExtractorImpl.Create(
            csvPath ?? this.csvPath
        )) as SpyCsvExtractor
    }
}
