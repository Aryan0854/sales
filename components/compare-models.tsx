"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUpIcon, BarChart3Icon, TargetIcon } from "lucide-react"

interface CompareModelsProps {
  rawData: Record<string, string>[]
}

export function CompareModels({ rawData }: CompareModelsProps) {
  // Mock Data for demonstration - these would typically come from a trained ML model
  // and are not directly derived from raw CSV data in the frontend.
  // They are kept as mock for now, with a note, until backend integration.
  const modelMetrics = [
    { model: "Linear Regression", rmse: 150, mae: 100, r2: 0.75, accuracy: 75 },
    { model: "K-Nearest Neighbors", rmse: 120, mae: 80, r2: 0.82, accuracy: 82 },
    { model: "Random Forest", rmse: 90, mae: 60, r2: 0.91, accuracy: 91 },
    { model: "XGBoost", rmse: 85, mae: 55, r2: 0.93, accuracy: 93 },
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compare Models</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3Icon className="h-5 w-5 text-blue-500" />
            Model Evaluation Metrics (Revenue Prediction)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>RMSE</TableHead>
                <TableHead>MAE</TableHead>
                <TableHead>R² Score</TableHead>
                <TableHead>Accuracy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelMetrics.map((metric) => (
                <TableRow key={metric.model}>
                  <TableCell className="font-medium">{metric.model}</TableCell>
                  <TableCell>{metric.rmse.toFixed(2)}</TableCell>
                  <TableCell>{metric.mae.toFixed(2)}</TableCell>
                  <TableCell>{metric.r2.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold text-green-600">{metric.accuracy}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-4 text-sm text-orange-500">
            Note: Model metrics are mock data. Connect to a backend for real ML model evaluation results.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="h-5 w-5 text-green-500" />
            Feature Importance (XGBoost Example)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number"
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 12 }}
                  domain={[0, 0.4]}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <YAxis 
                  type="category"
                  dataKey="feature"
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 12 }}
                  width={120}
                />
                <Tooltip 
                  formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Importance']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="importance" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">XGBoost</div>
            <p className="text-xs text-muted-foreground">93% Accuracy</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Training Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">2.3s</div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Prediction Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">0.05s</div>
            <p className="text-xs text-muted-foreground">Per Forecast</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
