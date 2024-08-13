export default class CsvExtractorImpl implements CsvExtractor {
    public static Class?: CsvExtractorConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface CsvExtractor {}

export type CsvExtractorConstructor = new () => CsvExtractor
