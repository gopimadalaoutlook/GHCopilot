# Bucks2Bar

A simple, responsive web application to track monthly income and expenses and visualize them with interactive charts.

## Features

- **Monthly Income & Expense Tracking**: Input income and expense data for all 12 months
- **Real-time Chart Visualization**: Chart updates automatically as you enter data with a 300ms debounce for smooth interaction
- **Data Persistence**: All data is saved to browser localStorage automatically
- **Responsive Design**: Built with Bootstrap 5 for mobile and desktop devices
- **Input Validation**: Negative values are highlighted with an invalid state
- **Chart Export**: Download the chart as a PNG image
- **Data Management**: Reset data or clear all saved data with dedicated buttons

## Getting Started

### Prerequisites

- A modern web browser with JavaScript enabled
- (Optional) Node.js 16+ if you want to run tests

### Running Locally

The simplest way to run Bucks2Bar is to open the HTML file directly in your browser:

```bash
# Option 1: Open directly in browser
open index.html
```

For better compatibility with some browsers, use a local HTTP server:

```bash
# Option 2: Using Python
python -m http.server 8000

# Then navigate to http://localhost:8000 in your browser
```

## Project Structure

```
├── index.html           # Main HTML markup with Bootstrap UI
├── script.js            # Application logic: debounced input handling, Chart.js integration, localStorage
├── script.test.js       # Jest unit tests
├── package.json         # Project metadata and dependencies
├── jest.config.js       # Jest test configuration
└── README.md            # This file
```

## How It Works

1. **Data Entry**: Enter monthly income and expense values in the table on the "Data" tab
2. **Debounced Updates**: Input changes are debounced to 300ms to optimize chart refresh performance
3. **Chart Visualization**: The "Charts" tab displays a grouped bar chart comparing income vs. expense for each month
4. **Data Storage**: All data is automatically saved to localStorage under the key `bucks2bar.data`
5. **Data Recovery**: On page reload, previously saved data is restored automatically

## Key Components

### Input Grid
- Income and expense inputs for January through December
- IDs follow the pattern: `income-01` through `income-12` and `expense-01` through `expense-12`
- Inputs are zero-padded and validate against negative values

### Chart
- Uses Chart.js library for rendering
- Green bars represent income, red bars represent expenses
- Live updates as input values change (debounced for performance)
- Downloadable as PNG

### Data Management
- **Reset Button**: Fills inputs with random default values and saves
- **Clear Saved Data Button**: Removes all stored data from localStorage
- Data is automatically persisted on every change

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch
```

### Technology Stack

- **HTML/CSS**: Bootstrap 5 framework for styling and responsive layout
- **JavaScript**: Vanilla JS with no framework dependencies
- **Chart.js**: Charting library (loaded from CDN)
- **Jest**: Testing framework
- **localStorage**: Browser API for data persistence

## Data Format

Data is stored in localStorage as JSON with the following structure:

```json
{
  "incomes": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "expenses": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "updated": "2026-02-14T12:00:00.000Z"
}
```

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- localStorage API
- CSS Grid/Flexbox
- Canvas API (for Chart.js)

## License

© 2026 Bucks2Bar

## Contributing

To make changes:

1. Maintain the existing data flow: inputs → debounced update → chart render → localStorage save
2. Keep the storage key consistent (`bucks2bar.data`) or provide migration logic for old data
3. Preserve the input ID naming convention when adding new fields
4. Test changes locally by opening the page in a browser
5. Run tests with `npm test` to ensure no regressions

## Tips

- Use the debounce `.flush()` functionality on blur/Enter events for immediate chart updates
- Currency formatting uses USD; modify `formatCurrency()` in `script.js` to support other currencies
- Chart datasets can be extended in `initChart()` by adding new data series and corresponding input groups
