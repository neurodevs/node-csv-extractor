# node-csv-extractor
Extract rows, columns, and cells from CSV files on Node

## Installation

`npm install @neurodevs/node-csv-extractor`

## Usage

```typescript
import { CsvExtractorImpl } from '@neurodevs/node-csv-extractor'

// In async function
const extractor = await CsvExtractorImpl.Create('/path/to/csv')

const extractedRecord = extractor.extract([
    {
        column: 'The column you want to search',
        value: 'The value to match in the specified column',
        extract: 'The column from which you want to extract data'
    },
    {
        column: ...,
        value: ...,
        extract: ...
    }
])
```

## Example use case for a stroboscopic session with EEG

Assumes that you have a CSV file with columns:

- `segment-name`
- `mean-alpha-band-power`

```typescript
import { CsvExtractorImpl } from '@neurodevs/node-csv-extractor'

// In async function
const extractor = await CsvExtractorImpl.Create('/path/to/csv')

const rules: ExtractionRule[] = []
const numTrials = 5

for (let i = 1; i <= numTrials; i++) {
    rules.push({
        column: 'segment-name',            // The column you want to search
        value: `eyes-closed-${i}`,         // The value to match in the specified column
        extract: 'mean-alpha-band-power',  // The column from which you want to extract data
    })
    rules.push({
        column: 'segment-name',
        value: `eyes-open-${i}`,
        extract: 'mean-alpha-band-power',
    })
}

const extractedRecord = extractor.extract(rules)

// Value of extractedRecord
//
//  {
//      "eyes-closed-1": 12.345,
//      "eyes-open-1": 10.987,
//      "eyes-closed-2": ...,
//      "eyes-open-2": ...,
//      "eyes-closed-3": ...,
//      "eyes-open-3": ...,
//      "eyes-closed-4": ...,
//      "eyes-open-4": ...,
//      "eyes-closed-5": ...,
//      "eyes-open-5": ...
//  },
```
