import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import CsvExtractorImpl from './CsvExtractor'

export default class CsvExtractorTest extends AbstractSpruceTest {
    // @ts-ignore
    private static assertOptions = CsvExtractorImpl.assertOptions

    private static extractor: SpyCsvExtractor

    protected static async beforeEach() {
        await super.beforeEach()

        this.setTestDouble()

        this.extractor = this.CsvExtractor()
    }

    @test()
    protected static async canCreateCsvExtractor() {
        assert.isTruthy(this.extractor)
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        this.clearTestDouble()
        assert.doesThrow(() => this.CsvExtractor(''))
    }

    @test()
    protected static async throwsIfCsvPathDoesNotExist() {
        this.clearTestDouble()
        assert.doesThrow(() => this.CsvExtractor('aoidjaidfjhadf'))
    }

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

    private static CsvExtractor(csvPath?: string) {
        return CsvExtractorImpl.Create(csvPath ?? 'aoidjf') as SpyCsvExtractor
    }
}

class SpyCsvExtractor extends CsvExtractorImpl {
    public constructor(csvPath: string) {
        super(csvPath)
    }
}
