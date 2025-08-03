import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def perform_eda(file_path):
    """
    Performs Exploratory Data Analysis (EDA) on the given CSV file.
    Generates and saves basic plots.
    """
    try:
        df = pd.read_csv(file_path)
        print("Data loaded successfully. First 5 rows:")
        print(df.head())

        print("\nData Info:")
        df.info()

        print("\nDescriptive Statistics for Numerical Columns:")
        print(df.describe())

        print("\nMissing Values:")
        print(df.isnull().sum())

        # Convert 'Order Date' to datetime
        df['Order Date'] = pd.to_datetime(df['Order Date'])
        df['Month'] = df['Order Date'].dt.month
        df['Year'] = df['Order Date'].dt.year

        # Sales over time
        monthly_sales = df.groupby(['Year', 'Month'])['Revenue'].sum().reset_index()
        monthly_sales['Date'] = pd.to_datetime(monthly_sales['Year'].astype(str) + '-' + monthly_sales['Month'].astype(str))
        plt.figure(figsize=(12, 6))
        sns.lineplot(x='Date', y='Revenue', data=monthly_sales)
        plt.title('Monthly Revenue Trends')
        plt.xlabel('Date')
        plt.ylabel('Total Revenue')
        plt.grid(True)
        plt.savefig('eda_monthly_revenue_trends.png')
        plt.close()
        print("Saved 'eda_monthly_revenue_trends.png'")

        # Sales by Category
        category_sales = df.groupby('Category')['Revenue'].sum().sort_values(ascending=False).reset_index()
        plt.figure(figsize=(10, 6))
        sns.barplot(x='Revenue', y='Category', data=category_sales)
        plt.title('Total Revenue by Category')
        plt.xlabel('Total Revenue')
        plt.ylabel('Category')
        plt.savefig('eda_revenue_by_category.png')
        plt.close()
        print("Saved 'eda_revenue_by_category.png'")

        # Sales by Sales Channel
        channel_sales = df.groupby('Sales Channel')['Revenue'].sum().sort_values(ascending=False).reset_index()
        plt.figure(figsize=(8, 5))
        sns.barplot(x='Sales Channel', y='Revenue', data=channel_sales)
        plt.title('Total Revenue by Sales Channel')
        plt.xlabel('Sales Channel')
        plt.ylabel('Total Revenue')
        plt.savefig('eda_revenue_by_channel.png')
        plt.close()
        print("Saved 'eda_revenue_by_channel.png'")

        # Customer Age Distribution
        plt.figure(figsize=(10, 6))
        sns.histplot(df['Customer Age'], bins=10, kde=True)
        plt.title('Customer Age Distribution')
        plt.xlabel('Customer Age')
        plt.ylabel('Number of Customers')
        plt.savefig('eda_customer_age_distribution.png')
        plt.close()
        print("Saved 'eda_customer_age_distribution.png'")

        print("\nEDA complete. Check the generated PNG files for visualizations.")

    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
    except Exception as e:
        print(f"An error occurred during EDA: {e}")

if __name__ == "__main__":
    csv_file_path = "public/data/Ecommerce_MultiBrand_Sales_RealBrands.csv"
    perform_eda(csv_file_path)
