"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartIcon, TrendingUpIcon, UsersIcon, PackageIcon } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useMemo } from "react"

interface OverviewDashboardProps {
  rawData: Record<string, string>[]
}

export function OverviewDashboard({ rawData }: OverviewDashboardProps) {
  const [timeframe, setTimeframe] = useState("monthly")

  const processedData = useMemo(() => {
    if (!rawData || rawData.length === 0) return { kpiData: {}, monthlySalesData: [] }

    // Convert relevant fields to numbers using the correct column names
    const data = rawData
      .map((row) => ({
        ...row,
        units_sold: Number.parseFloat(row["units_sold"] || "0"),
        revenue: Number.parseFloat(row["revenue"] || "0"),
        order_date: new Date(row["order_date"]),
        brand_name: row["brand_name"],
        category: row["category"],
        customer_age: Number.parseInt(row["customer_age"] || "0"),
        sales_channel: row["sales_channel"],
        country: row["country"],
        rating: Number.parseFloat(row["rating"] || "0"),
        delivery_time_days: Number.parseFloat(row["delivery_time_days"] || "0"),
      }))
      .filter(
        (row) =>
          !isNaN(row.units_sold) &&
          !isNaN(row.revenue) &&
          row.order_date instanceof Date &&
          !isNaN(row.order_date.getTime()),
      )

    // Calculate KPIs
    const totalSales = data.reduce((sum, row) => sum + row.revenue, 0)
    const totalUnitsSold = data.reduce((sum, row) => sum + row.units_sold, 0)
    const activeBrands = new Set(data.map((row) => row.brand_name)).size
    const activeProducts = new Set(data.map((row) => row.product_name)).size
    // Calculate return rate based on the 'returned' column
    const totalReturns = data.filter((row) => row.returned === "Yes").length
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
      const monthYear = row.order_date.toLocaleString("en-US", { month: "short", year: "numeric" })
      if (!monthlySalesMap.has(monthYear)) {
        monthlySalesMap.set(monthYear, { revenue: 0, units: 0 })
      }
      const current = monthlySalesMap.get(monthYear)!
      current.revenue += row.revenue
      current.units += row.units_sold
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{kpiData.totalSales}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
            <PackageIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{kpiData.totalUnitsSold}</div>
            <p className="text-xs text-muted-foreground">+18.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Brands</CardTitle>
            <UsersIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{kpiData.activeBrands}</div>
            <p className="text-xs text-muted-foreground">+5 new brands this quarter</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
            <BarChartIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{kpiData.returnRate}</div>
            <p className="text-xs text-muted-foreground">-0.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Sales Trends Over Time</CardTitle>
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
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? `$${Number(value).toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Units Sold'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="units" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
