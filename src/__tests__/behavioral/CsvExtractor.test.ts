import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import CsvExtractorImpl from '../../CsvExtractor'
import { SpyCsvExtractor } from '../../testDoubles/SpyCsvExtractor'

export default class CsvExtractorTest extends AbstractSpruceTest {
    // @ts-ignore
    private static assertOptions = CsvExtractorImpl.assertOptions

    private static extractor: SpyCsvExtractor
    private static csvPath: string

    protected static async beforeEach() {
        await super.beforeEach()

        this.setTestDouble()

        this.csvPath = generateId()
        this.extractor = this.CsvExtractor()
    }

    @test()
    protected static async canCreateCsvExtractor() {
        assert.isTruthy(this.extractor)
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        this.clearTestDouble()
        assert.doesThrow(() => this.CsvExtractor(''), this.optionsError)
    }

    @test()
    protected static async throwsIfCsvPathDoesNotExist() {
        this.clearTestDouble()

        const csvPath = generateId()
        const errorMatcher = `${this.fileNotFoundError}: "${csvPath}"!`

        assert.doesThrow(() => this.CsvExtractor(csvPath), errorMatcher)
    }

    @test()
    protected static async usesProvidedCsvPath() {
        const csvPath = this.extractor.getCsvPath()
        assert.isEqual(csvPath, this.csvPath)
    }

    private static readonly optionsError = 'MISSING_REQUIRED_OPTIONS: csvPath!'

    private static readonly fileNotFoundError = 'FILE_NOT_FOUND'

    private static setTestDouble() {
        // @ts-ignore
        CsvExtractorImpl.assertOptions = (_csvPath: string) => {}
        CsvExtractorImpl.Class = SpyCsvExtractor
    }

    private static clearTestDouble() {
        // @ts-ignore
        CsvExtractorImpl.assertOptions = this.assertOptions
        delete CsvExtractorImpl.Class
    }

    private static CsvExtractor(csvPath?: string | null) {
        return CsvExtractorImpl.Create(
            csvPath ?? this.csvPath
        ) as SpyCsvExtractor
    }
}
