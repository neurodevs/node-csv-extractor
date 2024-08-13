import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import CsvExtractorImpl, { CsvExtractor } from './CsvExtractor'

export default class CsvExtractorTest extends AbstractSpruceTest {
    private static extractor: CsvExtractor

    protected static async beforeEach() {
        await super.beforeEach()
        this.extractor = this.CsvExtractor()
    }

    @test()
    protected static async canCreateCsvExtractor() {
        assert.isTruthy(this.extractor)
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        assert.doesThrow(() => this.CsvExtractor(''))
    }

    private static CsvExtractor(csvPath?: string) {
        return CsvExtractorImpl.Create(csvPath ?? 'aoidjf')
    }
}
