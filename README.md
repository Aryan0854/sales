# E-commerce Sales Analytics Platform

A comprehensive sales analytics and forecasting platform built with Next.js, React, and TypeScript. This application provides interactive dashboards, advanced analytics, sales forecasting, and machine learning model comparison capabilities.

## 🚀 Live Demo

**🌐 Deployed on GitHub Pages**: [https://aryan0854.github.io/sales](https://aryan0854.github.io/sales)

## 🚀 Features

### 📊 **Overview Dashboard**
- **Real-time KPI Metrics**: Total sales, units sold, active brands, and return rates
- **Interactive Sales Trends**: Line chart showing revenue and units sold over time
- **Responsive Design**: Optimized for desktop and mobile devices
- **Color-coded Metrics**: Visual indicators with appropriate icons and colors

### 📈 **Interactive Analytics**
- **Sales Channel Performance**: Bar chart analysis of different sales channels
- **Customer Demographics**: Pie chart showing revenue distribution by age groups
- **Return Rate Analysis**: Category-wise return rate visualization
- **Advanced Filtering**: Filter by brand, category, and country
- **Real-time Data Processing**: Dynamic chart updates based on filters

### 🔮 **Sales Forecasting**
- **Multiple ML Models**: Linear Regression, KNN, Random Forest, XGBoost, LSTM, Prophet
- **Confidence Intervals**: Visual representation of prediction uncertainty
- **Forecast Horizons**: Daily, weekly, monthly, and quarterly predictions
- **Model Performance Metrics**: Accuracy, R² score, and confidence levels
- **Interactive Charts**: Area charts with actual vs predicted values

### 🤖 **Model Comparison**
- **Comprehensive Metrics**: RMSE, MAE, R² Score, and Accuracy comparison
- **Feature Importance**: Horizontal bar chart showing feature significance
- **Performance Benchmarks**: Training time and prediction speed metrics
- **Best Model Selection**: Automated identification of optimal model

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: React charting library for data visualization
- **Lucide React**: Modern icon library
- **Radix UI**: Accessible component primitives

### **Data Processing**
- **Custom CSV Parser**: Handles large files with chunked processing
- **Data Sampling**: Efficient processing of large datasets (5MB+)
- **Real-time Filtering**: Dynamic data filtering and aggregation

### **Styling & UI**
- **Shadcn/ui**: Modern component library
- **Responsive Design**: Mobile-first approach
- **Dark/Light Theme**: Theme switching capability
- **Custom Charts**: Tailored visualizations for business metrics

## 🚀 Quick Start

### **1. Clone the Repository**
```bash
git clone https://github.com/Aryan0854/sales.git
cd sales
```

### **2. Install Dependencies**
```bash
npm install
# or
pnpm install
```

### **3. Run Development Server**
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🚀 GitHub Deployment

### **Automatic Deployment**

This project is configured for automatic deployment to GitHub Pages. Simply push to the main branch:

```bash
git add .
git commit -m "Update sales analytics platform"
git push origin main
```

The GitHub Actions workflow will automatically:
- ✅ Build the project
- ✅ Run type checking and linting
- ✅ Deploy to GitHub Pages
- ✅ Make it available at: https://aryan0854.github.io/sales

### **Manual Deployment**

```bash
# Build the project
npm run build

# Export for static hosting
npm run export
```

### **Deployment Configuration**

- **GitHub Actions**: `.github/workflows/deploy.yml`
- **Static Export**: `next.config.mjs`
- **Build Scripts**: `package.json`

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 📁 Project Structure

```
sales-main/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── app/                        # Next.js App Router
│   ├── analytics/              # Analytics page
│   ├── compare-models/         # Model comparison page
│   ├── forecasting/            # Sales forecasting page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home/Overview page
├── components/                 # React components
│   ├── ui/                    # Reusable UI components
│   ├── overview-dashboard.tsx # Main dashboard
│   ├── interactive-analytics.tsx # Analytics component
│   ├── sales-forecasting.tsx  # Forecasting component
│   ├── compare-models.tsx     # Model comparison
│   └── app-sidebar.tsx        # Navigation sidebar
├── hooks/                     # Custom React hooks
│   ├── use-csv-data.ts        # CSV data loading hook
│   └── use-mobile.ts          # Mobile detection hook
├── lib/                       # Utility libraries
│   ├── csv-parser.ts          # CSV parsing logic
│   └── utils.ts               # Utility functions
├── public/                    # Static assets
│   └── data/                  # CSV data files
│       └── Ecommerce_MultiBrand_Sales_RealBrands.csv
├── scripts/                   # Python scripts
│   ├── eda.py                 # Exploratory data analysis
│   └── forecasting.py         # ML forecasting models
├── .gitignore                 # Git ignore rules
├── next.config.mjs           # Next.js configuration
├── package.json              # Dependencies and scripts
├── README.md                 # This documentation
└── DEPLOYMENT.md            # Deployment guide
```

## 📊 CSV Data Structure

### **Dataset: Ecommerce_MultiBrand_Sales_RealBrands.csv**

**File Size**: ~5MB (4,992,068 bytes)  
**Records**: Multiple thousands of sales transactions  
**Format**: Comma-separated values (CSV)

### **Column Schema**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `brand_name` | String | Brand/company name | "Nike", "Adidas" |
| `category` | String | Product category | "Shoes", "Apparel" |
| `product_name` | String | Product identifier | "Shoe_1", "Product_2" |
| `product_id` | String | Unique product ID | "42f0b5a2" |
| `country` | String | Sales country | "India", "Japan" |
| `city` | String | Sales city | "North Judithbury" |
| `order_date` | Date | Order date (YYYY-MM-DD) | "2024-01-23" |
| `units_sold` | Number | Quantity sold | 1, 3 |
| `revenue` | Number | Revenue in USD | 150.89, 366.58 |
| `customer_age` | Number | Customer age | 33, 20 |
| `customer_gender` | String | Customer gender | "Male", "Female" |
| `sales_channel` | String | Sales channel | "Online", "Retail" |
| `returned` | String | Return status | "Yes", "No" |
| `rating` | Number | Product rating | 3.7, 1.9 |
| `delivery_time_days` | Number | Delivery time | 15, 10 |

### **Data Characteristics**

- **Multi-brand**: Multiple e-commerce brands
- **Geographic diversity**: Sales across multiple countries
- **Time series**: Historical sales data
- **Customer demographics**: Age and gender information
- **Quality metrics**: Ratings and return rates
- **Operational data**: Delivery times and sales channels

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js 18+ 
- npm or pnpm
- Python 3.8+ (for ML scripts)

### **1. Clone the Repository**
```bash
git clone https://github.com/Aryan0854/sales.git
cd sales
```

### **2. Install Dependencies**
```bash
npm install
# or
pnpm install
```

### **3. Set Up Environment**
```bash
# Copy environment variables (if needed)
cp .env.example .env
```

### **4. Run Development Server**
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📈 Data Processing Pipeline

### **1. CSV Loading & Parsing**

**File**: `hooks/use-csv-data.ts`

```typescript
// Large file handling with sampling
if (text.length > 5000000) { // 5MB threshold
  const sampledData = await sampleLargeCSV(text)
  setData(sampledData)
  setIsSampled(true)
}
```

**Features**:
- **Chunked Processing**: Handles large files efficiently
- **Data Sampling**: Samples every 10th row for files >5MB
- **Error Handling**: Comprehensive error management
- **Loading States**: User-friendly loading indicators

### **2. Data Transformation**

**File**: `lib/csv-parser.ts`

```typescript
// Enhanced CSV parsing with quote handling
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false
  // ... parsing logic
}
```

**Features**:
- **Robust Parsing**: Handles quoted fields and special characters
- **Data Validation**: Filters invalid rows
- **Progress Tracking**: Logs processing progress
- **Memory Optimization**: Efficient memory usage

### **3. Real-time Analytics**

**File**: `components/interactive-analytics.tsx`

```typescript
// Dynamic filtering and aggregation
const filteredData = useMemo(() => {
  return rawData.filter((row) => {
    const matchesBrand = brandFilter !== "all" ? 
      row["brand_name"]?.toLowerCase().includes(brandFilter.toLowerCase()) : true
    // ... additional filters
  })
}, [rawData, brandFilter, categoryFilter, countryFilter])
```

## 🤖 Machine Learning Integration

### **Python Scripts**

**File**: `scripts/forecasting.py`

```python
def perform_forecasting(file_path):
    """
    Performs sales forecasting using multiple ML models
    """
    # Load and preprocess data
    df = pd.read_csv(file_path)
    
    # Feature engineering
    df['order_date'] = pd.to_datetime(df['order_date'])
    df['month'] = df['order_date'].dt.month
    df['year'] = df['order_date'].dt.year
    
    # Model training and evaluation
    models = {
        'Linear Regression': LinearRegression(),
        'Random Forest': RandomForestRegressor(),
        'XGBoost': XGBRegressor()
    }
    
    # Return model metrics and predictions
```

### **Model Comparison Metrics**

| Metric | Description | Formula |
|--------|-------------|---------|
| **RMSE** | Root Mean Square Error | √(Σ(y_pred - y_actual)²/n) |
| **MAE** | Mean Absolute Error | Σ|y_pred - y_actual|/n |
| **R² Score** | Coefficient of Determination | 1 - (SS_res/SS_tot) |
| **Accuracy** | Model Accuracy | Correct Predictions/Total Predictions |

## 🎨 UI/UX Features

### **Responsive Design**
- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible Layouts**: Grid and flexbox layouts
- **Touch-friendly**: Optimized for touch interactions

### **Theme System**
- **Dark/Light Mode**: Theme switching capability
- **Color Palette**: Consistent color scheme
- **Accessibility**: WCAG compliant design
- **Custom Components**: Tailored UI components

### **Interactive Elements**
- **Hover Effects**: Enhanced user interaction
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Tooltips**: Contextual information display

## 📊 Chart Types & Visualizations

### **1. Line Charts**
- **Sales Trends**: Revenue and units over time
- **Forecasting**: Actual vs predicted values
- **Features**: Smooth curves, data points, tooltips

### **2. Bar Charts**
- **Sales Channels**: Revenue by channel
- **Return Rates**: Category-wise returns
- **Features**: Rounded corners, color coding

### **3. Pie Charts**
- **Demographics**: Age group distribution
- **Features**: Labels, percentages, custom colors

### **4. Area Charts**
- **Forecasting**: Confidence intervals
- **Features**: Gradient fills, multiple series

## 🔍 Performance Optimizations

### **1. Data Loading**
- **Lazy Loading**: Load data on demand
- **Caching**: Browser-level caching
- **Compression**: Gzip compression for large files

### **2. Chart Rendering**
- **ResponsiveContainer**: Automatic resizing
- **Virtualization**: Handle large datasets
- **Debouncing**: Optimize filter updates

### **3. Memory Management**
- **Garbage Collection**: Proper cleanup
- **Memory Leaks**: Prevent memory leaks
- **Efficient Parsing**: Stream processing

## 🧪 Testing Strategy

### **1. Unit Tests**
```typescript
// CSV parser tests
describe('parseCSV', () => {
  it('should parse valid CSV data', () => {
    const csvData = 'brand_name,revenue\nNike,100\nAdidas,200'
    const result = parseCSV(csvData)
    expect(result).toHaveLength(2)
  })
})
```

### **2. Integration Tests**
- **Data Flow**: End-to-end data processing
- **Component Integration**: Chart rendering
- **API Integration**: Data fetching

### **3. Performance Tests**
- **Large File Handling**: 5MB+ CSV files
- **Memory Usage**: Memory leak detection
- **Rendering Speed**: Chart rendering performance

## 🚀 Deployment

### **GitHub Pages Deployment**

This project is configured for automatic deployment to GitHub Pages:

1. **Push to Main Branch**: Automatic deployment via GitHub Actions
2. **Manual Build**: `npm run build && npm run export`
3. **Live URL**: https://aryan0854.github.io/sales

### **Build Process**
```bash
npm run build
npm run start
```

### **Environment Variables**
```env
NEXT_PUBLIC_API_URL=your-api-url
NEXT_PUBLIC_CSV_PATH=/data/sales-data.csv
```

### **Production Considerations**
- **CDN**: Static asset delivery
- **Caching**: Browser and server caching
- **Compression**: Gzip/Brotli compression
- **Monitoring**: Performance monitoring

## 🔧 Customization

### **1. Adding New Charts**
```typescript
// Create new chart component
export function CustomChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        {/* Chart configuration */}
      </LineChart>
    </ResponsiveContainer>
  )
}
```

### **2. Custom Data Processing**
```typescript
// Add custom data transformations
const customProcessedData = useMemo(() => {
  return rawData.map(row => ({
    ...row,
    customMetric: calculateCustomMetric(row)
  }))
}, [rawData])
```

### **3. Theme Customization**
```css
/* Custom theme variables */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --accent-color: #f59e0b;
}
```

## 📚 API Documentation

### **Data Hooks**

#### `useCsvData(filePath: string)`
Returns processed CSV data with loading states.

```typescript
const { data, loading, error, isSampled } = useCsvData("/data/sales.csv")
```

**Returns**:
- `data`: Processed CSV data array
- `loading`: Loading state boolean
- `error`: Error message string
- `isSampled`: Whether data was sampled

### **Component Props**

#### `OverviewDashboard`
```typescript
interface OverviewDashboardProps {
  rawData: Record<string, string>[]
}
```

#### `InteractiveAnalytics`
```typescript
interface InteractiveAnalyticsProps {
  rawData: Record<string, string>[]
}
```

## 🤝 Contributing

### **1. Development Setup**
```bash
# Fork the repository
git clone <your-fork-url>
cd sales

# Install dependencies
npm install

# Start development server
npm run dev
```

### **2. Code Style**
- **TypeScript**: Strict type checking
- **ESLint**: Code linting rules
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format

### **3. Testing**
```bash
# Run tests
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Recharts**: Charting library
- **Tailwind CSS**: Utility-first CSS
- **Radix UI**: Accessible components
- **Lucide**: Icon library
- **Next.js**: React framework

## 📞 Support

For support and questions:
- **Issues**: Create GitHub issues
- **Discussions**: Use GitHub discussions
- **Email**: Contact maintainers

---

**🌐 Live Demo**: [https://aryan0854.github.io/sales](https://aryan0854.github.io/sales)  
**📚 Repository**: [https://github.com/Aryan0854/sales](https://github.com/Aryan0854/sales)  
**Built with ❤️ using Next.js, React, and TypeScript**
