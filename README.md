# node-csv-extractor
Extract data from CSV files using user-defined rules.

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
        value: 'The value to match in the column',
        extract: 'The column to extract data from',
    },
    {
        column: 'Another column to search',
        value: 'Another value to match',
        extract: 'Another column to extract',
    }
])
```

## Example use case for a stroboscopic session with EEG

### Example CSV Format

| segment-name    | mean-alpha-band-power |
|-----------------|-----------------------|
| eyes-closed-1   | [ Number ]           |
| eyes-open-1     | [ Number ]           |
| eyes-closed-2   | [ Number ]           |
| ...             | ...                    |
| eyes-closed-5   | [ Number ]           |
| eyes-open-5     | [ Number ]           |

### Example Code

```typescript
import { CsvExtractorImpl } from '@neurodevs/node-csv-extractor'

// In async function
const extractor = await CsvExtractorImpl.Create('/path/to/csv')

const rules: ExtractionRule[] = []
const numTrials = 5

for (let i = 1; i <= numTrials; i++) {
    rules.push({
        column: 'segment-name',            // The column to search
        value: `eyes-closed-${i}`,         // The value to match
        extract: 'mean-alpha-band-power',  // The column to extract
    })
    rules.push({
        column: 'segment-name',
        value: `eyes-open-${i}`,
        extract: 'mean-alpha-band-power',
    })
}

const extractedRecord = extractor.extract(rules)

//  Example value of extractedRecord:
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
### Example Explanation

#### Async Static Creation Method
`await CsvExtractorImpl.Create('/path/to/csv')` asynchronously creates an instance of CsvExtractorImpl, which automatically loads the CSV file at the provided path.

#### Extraction Rules
- The `ExtractionRule[]` type specifies which data to extract from the CSV. Each rule searches for a specific value in a specified column and extracts data from another column (or the same column) in the matched row.

#### Eyes Open/Closed Trials
- The `for` loop creates rules for multiple trials, extracting data for both "eyes-closed" and "eyes-open" segments.
