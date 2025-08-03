"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartIcon } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useMemo } from "react"

interface OverviewDashboardProps {
  rawData: Record<string, string>[]
}

export function OverviewDashboard({ rawData }: OverviewDashboardProps) {
  const [timeframe, setTimeframe] = useState("monthly")

  const processedData = useMemo(() => {
    if (!rawData || rawData.length === 0) return { kpiData: {}, monthlySalesData: [] }

    // Convert relevant fields to numbers
    const data = rawData
      .map((row) => ({
        ...row,
        "Units Sold": Number.parseFloat(row["Units Sold"]),
        Revenue: Number.parseFloat(row["Revenue"]),
        "Order Date": new Date(row["Order Date"]),
        "Brand Name": row["Brand Name"],
        Category: row["Category"],
        "Customer Age": Number.parseInt(row["Customer Age"]),
        "Sales Channel": row["Sales Channel"],
        Country: row["Country"],
        Rating: Number.parseFloat(row["Rating"]),
        "Delivery Time Days": Number.parseFloat(row["Delivery Time Days"]),
      }))
      .filter(
        (row) =>
          !isNaN(row["Units Sold"]) &&
          !isNaN(row["Revenue"]) &&
          row["Order Date"] instanceof Date &&
          !isNaN(row["Order Date"].getTime()),
      )

    // Calculate KPIs
    const totalSales = data.reduce((sum, row) => sum + row["Revenue"], 0)
    const totalUnitsSold = data.reduce((sum, row) => sum + row["Units Sold"], 0)
    const activeBrands = new Set(data.map((row) => row["Brand Name"])).size
    const activeProducts = new Set(data.map((row) => row["Product Name"])).size
    // For return rate, we'll need a more sophisticated logic if there's no explicit 'returned' column.
    // For now, let's assume a mock return rate or derive it if possible from categories.
    // If 'Returns' is a category, we can count it. Otherwise, this remains mock.
    const totalReturns = data.filter((row) => row["Category"] === "Returns").length // Example if 'Returns' is a category
    const totalOrders = data.length
    const returnRate = totalOrders > 0 ? (totalReturns / totalOrders) * 100 : 0

    const kpiData = {
      totalSales: `$${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      totalUnitsSold: totalUnitsSold.toLocaleString(),
      activeBrands: activeBrands.toLocaleString(),
      activeProducts: `${activeProducts.toLocaleString()}+`,
      returnRate: `${returnRate.toFixed(1)}%`,
    }

    // Aggregate monthly sales data
    const monthlySalesMap = new Map<string, { revenue: number; units: number }>()
    data.forEach((row) => {
      const monthYear = row["Order Date"].toLocaleString("en-US", { month: "short", year: "numeric" })
      if (!monthlySalesMap.has(monthYear)) {
        monthlySalesMap.set(monthYear, { revenue: 0, units: 0 })
      }
      const current = monthlySalesMap.get(monthYear)!
      current.revenue += row["Revenue"]
      current.units += row["Units Sold"]
    })

    const monthlySalesData = Array.from(monthlySalesMap.entries())
      .map(([monthYear, values]) => ({ month: monthYear, ...values }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

    return { kpiData, monthlySalesData }
  }, [rawData])

  const { kpiData, monthlySalesData } = processedData

  const chartData = useMemo(() => {
    if (timeframe === "monthly") {
      return monthlySalesData
    }
    // Example for different timeframes - currently just slices monthly data
    return monthlySalesData.slice(0, 6)
  }, [timeframe, monthlySalesData])

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
        <h1 className="text-3xl font-bold">Overview Dashboard</h1>
        {/* Removed "Upload New Data" button as per user request */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalSales}</div>
            <p className="text-xs text-muted-foreground">{"&#43;20.1% from last month"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalUnitsSold}</div>
            <p className="text-xs text-muted-foreground">{"&#43;18.5% from last month"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Brands</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.activeBrands}</div>
            <p className="text-xs text-muted-foreground">{"&#43;5 new brands this quarter"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.returnRate}</div>
            <p className="text-xs text-muted-foreground">{"&#45;0.3% from last month"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales Trends Over Time</CardTitle>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
              units: {
                label: "Units Sold",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="aspect-video h-[300px]"
          >
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="units" stroke="var(--color-units)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
