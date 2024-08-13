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

    private static CsvExtractor() {
        return CsvExtractorImpl.Create()
    }
}
