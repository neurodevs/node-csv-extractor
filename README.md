# node-csv-extractor
Extract rows, columns, and cells from CSV files on Node

## Installation

`npm install @neurodevs/node-csv-extractor`

## Usage

```typescript
import { CsvExtractorImpl } from '@neurodevs/node-csv-extractor'

// In async function
const extractor = await CsvExtractorImpl.Create('/path/to/csv')

const extractedData = extractor.extract([
    {
        column: 'The column you want to search along',
        value: 'The row to select of the column if it equals',
        extract: 'The column name you want to extract from the matched row'
    },
    {
        column: '...',
        value: '...',
        extract: '...'
    }
])
```
