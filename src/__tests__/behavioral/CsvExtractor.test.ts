import fs from 'fs'
import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import csvParser from 'csv-parser'
import CsvExtractorImpl from '../../CsvExtractor'
import { SpyCsvExtractor } from '../../testDoubles/SpyCsvExtractor'

export default class CsvExtractorTest extends AbstractSpruceTest {
    // @ts-ignore
    private static assertOptions = CsvExtractorImpl.assertOptions
    // @ts-ignore
    private static loadCsvData = CsvExtractorImpl.loadCsvData

    private static extractor: SpyCsvExtractor
    private static csvPath: string

    protected static async beforeEach() {
        await super.beforeEach()

        this.setTestDouble()

        this.csvPath = generateId()
        this.extractor = await this.CsvExtractor()
    }

    @test()
    protected static async canCreateCsvExtractor() {
        assert.isTruthy(this.extractor)
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        this.clearTestDouble()

        await assert.doesThrowAsync(
            async () => await this.CsvExtractor(''),
            this.optionsError
        )
    }

    @test()
    protected static async throwsIfCsvPathDoesNotExist() {
        this.clearTestDouble()

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
        const csvPath = this.extractor.getCsvPath()
        assert.isEqual(csvPath, this.csvPath)
    }

    @test()
    protected static async loadsCsvDataOnCreate() {
        this.clearFakeMethods()

        const csvPath = 'src/__tests__/testData/test.csv'
        const extractor = await this.CsvExtractor(csvPath)
        const csvData = extractor.getCsvData()

        const expectedCsvData = await this.loadCsv(csvPath)

        assert.isEqualDeep(csvData, expectedCsvData)
    }

    @test()
    protected static async extractReturnsCsvDataWithNoRules() {
        const csvData = this.extractor.extract()
        assert.isEqualDeep(csvData, this.extractor.getCsvData())
    }

    private static async loadCsv(csvPath: string) {
        return new Promise((resolve, reject) => {
            const data: any[] = []
            fs.createReadStream(csvPath)
                .pipe(csvParser())
                .on('data', (row) => data.push(row))
                .on('end', () => resolve(data))
                .on('error', (err) => reject(err))
        })
    }

    private static readonly optionsError = 'MISSING_REQUIRED_OPTIONS: csvPath!'

    private static readonly fileNotFoundError = 'FILE_NOT_FOUND'

    private static setTestDouble() {
        this.fakeMethods()
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

    private static clearTestDouble() {
        this.clearFakeMethods()
        delete CsvExtractorImpl.Class
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
