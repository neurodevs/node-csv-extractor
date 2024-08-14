import { CsvExtractor, ExtractionRule, ExtractedResult } from '../types'

export default class FakeCsvExtractor implements CsvExtractor {
    public wasExtractCalled = false
    public extractCalledWith: ExtractionRule[][] = []

    public extract(rules: ExtractionRule[]) {
        this.wasExtractCalled = true
        this.extractCalledWith.push(rules)
        return {} as ExtractedResult
    }
}
