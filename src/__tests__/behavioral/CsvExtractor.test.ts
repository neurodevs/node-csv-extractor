import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
} from '@sprucelabs/test-utils'
import { CsvLoaderImpl, FakeCsvLoader } from '@neurodevs/node-csv-loader'
import CsvExtractorImpl from '../../CsvExtractor'
import SpyCsvExtractor from '../../testDoubles/SpyCsvExtractor'
import { ExtractionRule } from '../../types'

export default class CsvExtractorTest extends AbstractSpruceTest {
    private static testCsvPath: string

    private static extractor: SpyCsvExtractor

    protected static async beforeEach() {
        await super.beforeEach()

        this.setTestDoubles()

        this.testCsvPath = 'src/__tests__/testData/test.csv'
        this.extractor = await this.CsvExtractor()
    }

    @test()
    protected static async canCreateCsvExtractor() {
        assert.isTruthy(this.extractor)
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        // @ts-ignore
        const err = await assert.doesThrowAsync(() => CsvExtractorImpl.Create())
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['csvPath'],
        })
    }

    @test()
    protected static async usesProvidedCsvPath() {
        assert.isEqual(this.extractor.csvPath, this.testCsvPath)
    }

    @test()
    protected static async loadsCsvDataOnCreate() {
        const { csvData } = await this.CsvExtractor(this.testCsvPath)
        assert.isEqualDeep(csvData, this.testData)
    }

    @test('extractReturnsCorrectValue: column_3', '3')
    @test('extractReturnsCorrectValue: column_2', '2')
    @test('extractReturnsCorrectValue: column_1', '1')
    protected static async extractReturnsCorrectValue(columnNum: string) {
        const realExtractor = await this.CsvExtractor(this.testCsvPath)

        const column = `column_${columnNum}`

        const rules: ExtractionRule[] = [
            {
                column,
                value: `${columnNum}`,
                extract: column,
            },
        ]

        const record = realExtractor.extract(rules)

        const expected = {
            [columnNum]: Number(columnNum),
        }

        assert.isEqualDeep(record, expected)
    }

    @test()
    protected static async returnsNumericValuesAsNumbers() {
        const realExtractor = await this.CsvExtractor(this.testCsvPath)

        const rules: ExtractionRule[] = [
            {
                column: 'column_1',
                value: '1',
                extract: 'column_1',
            },
        ]

        const record = realExtractor.extract(rules)

        Object.values(record).forEach((value) => assert.isNumber(value))
    }

    private static setTestDoubles() {
        CsvLoaderImpl.Class = FakeCsvLoader
        FakeCsvLoader.setFakeData(this.testData)

        CsvExtractorImpl.Class = SpyCsvExtractor
        SpyCsvExtractor.shouldThrow = false
    }

    private static get testData() {
        return [
            { column_1: '1', column_2: '2', column_3: '3' },
            { column_1: '4', column_2: '5', column_3: '6' },
            { column_1: '7', column_2: '8', column_3: '9' },
        ]
    }

    private static async CsvExtractor(csvPath?: string) {
        return (await CsvExtractorImpl.Create(
            csvPath ?? this.testCsvPath
        )) as SpyCsvExtractor
    }
}
