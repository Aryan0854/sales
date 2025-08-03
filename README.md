# E-commerce Sales Insight and Forecasting Platform

This project provides a frontend dashboard for visualizing e-commerce sales data and mock forecasting results.

## Features

*   **Overview Dashboard:** Key Performance Indicators (KPIs) and sales trends.
*   **Interactive Analytics:** Filterable charts for sales channels, demographics, and return rates.
*   **Sales Forecasting:** Visualization of mock actual vs. predicted sales with confidence intervals.
*   **Model Comparison:** Mock evaluation metrics and feature importance for different ML models.

## Data

The dashboard currently uses mock data loaded from `public/data/Ecommerce_MultiBrand_Sales_RealBrands.csv`.

## Getting Started

1.  **Install Dependencies:**
    \`\`\`bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    \`\`\`
2.  **Run the Development Server:**
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

*   `app/`: Next.js App Router pages.
*   `components/`: React components for the dashboard UI.
*   `public/data/`: Contains the `Ecommerce_MultiBrand_Sales_RealBrands.csv` file.
*   `scripts/`: Python scripts for EDA and forecasting (to be run separately).
*   `hooks/`: Custom React hooks.
*   `lib/`: Utility functions.

## Next Steps

*   **Implement Backend:** Develop a Flask/FastAPI backend to serve real data from a database and integrate ML models for actual forecasting and analytics.
*   **Connect Frontend to Backend:** Replace mock data fetching with API calls to your backend.
*   **Database Integration:** Set up a database (e.g., PostgreSQL, MongoDB) to store and manage your sales data.
*   **Authentication:** Add user authentication to secure the dashboard.
*   **Refine ML Models:** Develop and integrate robust machine learning models for accurate sales forecasting and deeper insights.
\`\`\`
