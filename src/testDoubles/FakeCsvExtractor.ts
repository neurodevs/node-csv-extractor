import { CsvExtractor, ExtractedResult, ExtractionRule } from '../CsvExtractor'

export default class FakeCsvExtractor implements CsvExtractor {
    public wasExtractCalled = false
    public extractCalledWith: ExtractionRule[][] = []

    public extract(rules: ExtractionRule[]) {
        this.extractCalledWith.push(rules)
        return {} as ExtractedResult
    }
}
