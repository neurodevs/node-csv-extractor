# node-csv-extractor

Extract data from CSV files using rules you define.

## Installation

Install the package using npm:

```bash
npm install @neurodevs/node-csv-extractor
```

Or yarn:

```bash
yarn add @neurodevs/node-csv-extractor
```

## Usage

To extract data from a CSV file based on a set of rules:

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

## Example Use Case for a Stroboscopic Session with EEG

### Example CSV Format

| segment-name    | mean-alpha-band-power |
|-----------------|-----------------------|
| eyes-closed-1   | 12.345                |
| eyes-open-1     | 10.987                |
| ...             | ...                   |
| eyes-closed-5   | ...                   |
| eyes-open-5     | ...                   |

### Example Code

```typescript
import { CsvExtractorImpl, ExtractionRule } from '@neurodevs/node-csv-extractor'

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

// Example value of extractedRecord:
//
//  {
//      "eyes-closed-1": 12.345,
//      "eyes-open-1": 10.987,
//      ...
//      "eyes-closed-5": ...,
//      "eyes-open-5": ...
//  }
```

### Example Explanation

#### Async Static Creation Method
- **`await CsvExtractorImpl.Create('/path/to/csv')`**: Asynchronously creates an instance of `CsvExtractorImpl`, which automatically loads the CSV file at the provided path.

#### Eyes Open/Closed Trials
- **`for` loop**: Generates extraction rules for multiple trials, retrieving data for both "eyes-closed" and "eyes-open" segments.

#### Extraction Rules
- **`extractor.extract(rules)`**: The method defines criteria for extracting data from the CSV file. Each rule specifies a target value to search for in a column and identifies which column’s data to extract from the matching row.

## Testing

You can use the following test doubles for unit testing purposes:

```typescript
import { FakeCsvExtractor, SpyCsvExtractor } from '@neurodevs/node-csv-extractor'

// Use FakeCsvExtractor for simulating the extraction process in tests
CsvExtractorImpl.Class = FakeCsvExtractor

// Use SpyCsvExtractor to test real behavior with enhanced internal visibility
CsvExtractorImpl.Class = SpyCsvExtractor

const extractor = await CsvExtractorImpl.Create('/path/to/csv')
```

- **`FakeCsvExtractor`**: Provides a fake implementation to simulate data extraction in tests.
- **`SpyCsvExtractor`**: Wraps the real implementation with enhanced visibility for inspecting internal behavior during testing.

