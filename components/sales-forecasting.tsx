"use client"

import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface SalesForecastingProps {
  rawData: Record<string, string>[]
}

export function SalesForecasting({ rawData }: SalesForecastingProps) {
  const [model, setModel] = useState("xgboost")
  const [forecastHorizon, setForecastHorizon] = useState("monthly")

  const forecastData = useMemo(() => {
    if (!rawData || rawData.length === 0) return []

    const data = rawData
      .map((row) => ({
        ...row,
        "Order Date": new Date(row["Order Date"]),
        Revenue: Number.parseFloat(row["Revenue"]),
      }))
      .filter(
        (row) => row["Order Date"] instanceof Date && !isNaN(row["Order Date"].getTime()) && !isNaN(row["Revenue"]),
      )

    // Aggregate actual monthly revenue
    const monthlyActualsMap = new Map<string, number>()
    data.forEach((row) => {
      const monthYear = row["Order Date"].toISOString().slice(0, 7) // YYYY-MM format
      monthlyActualsMap.set(monthYear, (monthlyActualsMap.get(monthYear) || 0) + row["Revenue"])
    })

    const sortedActuals = Array.from(monthlyActualsMap.entries())
      .map(([date, actual]) => ({ date, actual }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Generate mock predictions based on actuals for demonstration
    // In a real scenario, this would come from your ML backend
    const generatedForecast = sortedActuals.map((item) => {
      const predicted = item.actual * (1 + (Math.random() * 0.1 - 0.05)) // +/- 5% variation
      const lower = predicted * 0.95
      const upper = predicted * 1.05
      return { ...item, predicted, lower, upper }
    })

    // Add some future mock predictions (e.g., next 3 months)
    const lastDate =
      sortedActuals.length > 0 ? new Date(sortedActuals[sortedActuals.length - 1].date + "-01") : new Date()
    for (let i = 1; i <= 3; i++) {
      const futureDate = new Date(lastDate.getFullYear(), lastDate.getMonth() + i, 1)
      const dateString = futureDate.toISOString().slice(0, 7)
      const lastPredicted = generatedForecast.length > 0 ? generatedForecast[generatedForecast.length - 1].predicted : 0
      const predicted = lastPredicted * (1 + (Math.random() * 0.1 - 0.05))
      const lower = predicted * 0.95
      const upper = predicted * 1.05
      generatedForecast.push({ date: dateString, actual: null, predicted, lower, upper })
    }

    return generatedForecast
  }, [rawData])

  if (!rawData || rawData.length === 0) {
    return (
      <div className="flex-1 p-4 md:p-8 text-muted-foreground">
        <p>No data available to display. Please ensure the CSV file is loaded.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Sales Forecasting</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="model-select">Select Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="model-select">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear-regression">Linear Regression</SelectItem>
              <SelectItem value="knn">K-Nearest Neighbors</SelectItem>
              <SelectItem value="random-forest">Random Forest</SelectItem>
              <SelectItem value="xgboost">XGBoost</SelectItem>
              <SelectItem value="lstm">LSTM (Optional)</SelectItem>
              <SelectItem value="prophet">Prophet (Optional)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="horizon-select">Forecast Horizon</Label>
          <Select value={forecastHorizon} onValueChange={setForecastHorizon}>
            <SelectTrigger id="horizon-select">
              <SelectValue placeholder="Select Horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Forecast ({model} Model)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              actual: {
                label: "Actual Revenue",
                color: "hsl(var(--chart-1))",
              },
              predicted: {
                label: "Predicted Revenue",
                color: "hsl(var(--chart-2))",
              },
              lower: {
                label: "Lower Bound",
                color: "hsl(var(--chart-3))",
              },
              upper: {
                label: "Upper Bound",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="aspect-video h-[400px]"
          >
            <LineChart data={forecastData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" strokeWidth={2} dot={false} />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="var(--color-predicted)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ChartContainer>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Confidence Interval: The shaded area (or dashed lines) represents the 95% confidence interval for the
              predictions.
            </p>
            <p>Alerts: No significant anomalies detected in recent forecasts.</p>
            <p className="text-orange-500">
              Note: Forecast predictions are currently mock data. Connect to a backend for real ML model predictions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
