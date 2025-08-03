"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface CompareModelsProps {
  rawData: Record<string, string>[]
}

export function CompareModels({ rawData }: CompareModelsProps) {
  // Mock Data for demonstration - these would typically come from a trained ML model
  // and are not directly derived from raw CSV data in the frontend.
  // They are kept as mock for now, with a note, until backend integration.
  const modelMetrics = [
    { model: "Linear Regression", rmse: 150, mae: 100, r2: 0.75 },
    { model: "K-Nearest Neighbors", rmse: 120, mae: 80, r2: 0.82 },
    { model: "Random Forest", rmse: 90, mae: 60, r2: 0.91 },
    { model: "XGBoost", rmse: 85, mae: 55, r2: 0.93 },
  ]

  const featureImportanceData = [
    { feature: "Order Date (Month)", importance: 0.35 },
    { feature: "Brand Name", importance: 0.25 },
    { feature: "Category", importance: 0.15 },
    { feature: "Customer Age", importance: 0.1 },
    { feature: "Sales Channel", importance: 0.08 },
    { feature: "Country", importance: 0.07 },
  ]

  if (!rawData || rawData.length === 0) {
    return (
      <div className="flex-1 p-4 md:p-8 text-muted-foreground">
        <p>No data available to display. Please ensure the CSV file is loaded.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Compare Models</h1>

      <Card>
        <CardHeader>
          <CardTitle>Model Evaluation Metrics (Revenue Prediction)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>RMSE</TableHead>
                <TableHead>MAE</TableHead>
                <TableHead>R² Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelMetrics.map((metric) => (
                <TableRow key={metric.model}>
                  <TableCell className="font-medium">{metric.model}</TableCell>
                  <TableCell>{metric.rmse.toFixed(2)}</TableCell>
                  <TableCell>{metric.mae.toFixed(2)}</TableCell>
                  <TableCell>{metric.r2.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-4 text-sm text-orange-500">
            Note: Model metrics are mock data. Connect to a backend for real ML model evaluation results.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Importance (XGBoost Example)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              importance: {
                label: "Importance",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="aspect-video h-[350px]"
          >
            <BarChart data={featureImportanceData}>
              <CartesianGrid horizontal={false} />
              <XAxis
                dataKey="feature"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="importance" fill="var(--color-importance)" radius={8} />
            </BarChart>
          </ChartContainer>
          <p className="mt-4 text-sm text-orange-500">
            Note: Feature importance data is mock. Connect to a backend for real ML model feature importance.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
