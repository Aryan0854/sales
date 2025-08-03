import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import matplotlib.pyplot as plt
import numpy as np

def perform_forecasting(file_path):
    """
    Performs a basic sales forecasting using Linear Regression.
    This is a simplified example and would typically involve more advanced
    time series models and feature engineering.
    """
    try:
        df = pd.read_csv(file_path)

        # Convert 'Order Date' to datetime and set as index
        df['Order Date'] = pd.to_datetime(df['Order Date'])
        df.set_index('Order Date', inplace=True)

        # Aggregate daily sales
        daily_sales = df.resample('D')['Revenue'].sum().fillna(0)

        # Create a DataFrame for forecasting
        forecast_df = pd.DataFrame(daily_sales)
        forecast_df['DayOfYear'] = forecast_df.index.dayofyear
        forecast_df['DayOfWeek'] = forecast_df.index.dayofweek
        forecast_df['Month'] = forecast_df.index.month
        forecast_df['Year'] = forecast_df.index.year

        # Prepare data for Linear Regression
        X = forecast_df[['DayOfYear', 'DayOfWeek', 'Month', 'Year']]
        y = forecast_df['Revenue']

        # Split data into training and testing sets
        # Using a time-based split for forecasting
        train_size = int(len(X) * 0.8)
        X_train, X_test = X.iloc[:train_size], X.iloc[train_size:]
        y_train, y_test = y.iloc[:train_size], y.iloc[train_size:]

        # Train Linear Regression model
        model = LinearRegression()
        model.fit(X_train, y_train)

        # Make predictions on the test set
        predictions = model.predict(X_test)

        # Evaluate the model
        rmse = np.sqrt(mean_squared_error(y_test, predictions))
        mae = mean_absolute_error(y_test, predictions)
        r2 = r2_score(y_test, predictions)

        print(f"\nForecasting Model: Linear Regression")
        print(f"RMSE: {rmse:.2f}")
        print(f"MAE: {mae:.2f}")
        print(f"R2 Score: {r2:.2f}")

        # Plotting actual vs predicted sales
        plt.figure(figsize=(14, 7))
        plt.plot(y_train.index, y_train, label='Actual Sales (Train)', color='blue')
        plt.plot(y_test.index, y_test, label='Actual Sales (Test)', color='green')
        plt.plot(y_test.index, predictions, label='Predicted Sales (Test)', color='red', linestyle='--')
        plt.title('Sales Forecasting: Actual vs. Predicted')
        plt.xlabel('Date')
        plt.ylabel('Revenue')
        plt.legend()
        plt.grid(True)
        plt.savefig('forecasting_actual_vs_predicted.png')
        plt.close()
        print("Saved 'forecasting_actual_vs_predicted.png'")

        # Generate future dates for forecasting (e.g., next 30 days)
        last_date = forecast_df.index.max()
        future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=30, freq='D')
        future_df = pd.DataFrame(index=future_dates)
        future_df['DayOfYear'] = future_df.index.dayofyear
        future_df['DayOfWeek'] = future_df.index.dayofweek
        future_df['Month'] = future_df.index.month
        future_df['Year'] = future_df.index.year

        future_predictions = model.predict(future_df[['DayOfYear', 'DayOfWeek', 'Month', 'Year']])

        plt.figure(figsize=(14, 7))
        plt.plot(daily_sales.index, daily_sales, label='Historical Sales', color='blue')
        plt.plot(future_dates, future_predictions, label='Future Forecast', color='purple', linestyle='--')
        plt.title('Sales Forecasting: Historical and Future Predictions')
        plt.xlabel('Date')
        plt.ylabel('Revenue')
        plt.legend()
        plt.grid(True)
        plt.savefig('forecasting_future_predictions.png')
        plt.close()
        print("Saved 'forecasting_future_predictions.png'")

        print("\nForecasting complete. Check the generated PNG files for visualizations.")

    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
    except Exception as e:
        print(f"An error occurred during forecasting: {e}")

if __name__ == "__main__":
    csv_file_path = "public/data/Ecommerce_MultiBrand_Sales_RealBrands.csv"
    perform_forecasting(csv_file_path)
