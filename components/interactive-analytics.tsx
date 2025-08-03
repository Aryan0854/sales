"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { TrendingUpIcon, UsersIcon, ShoppingCartIcon, StarIcon } from "lucide-react"

interface InteractiveAnalyticsProps {
  rawData: Record<string, string>[]
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function InteractiveAnalytics({ rawData }: InteractiveAnalyticsProps) {
  const [brandFilter, setBrandFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")

  const filteredData = useMemo(() => {
    if (!rawData || rawData.length === 0) return []
    return rawData
      .filter((row) => {
        const matchesBrand =
          brandFilter !== "all" ? row["brand_name"]?.toLowerCase().includes(brandFilter.toLowerCase()) : true
        const matchesCategory = categoryFilter !== "all" ? row["category"] === categoryFilter : true
        const matchesCountry = countryFilter !== "all" ? row["country"] === countryFilter : true
        return matchesBrand && matchesCategory && matchesCountry
      })
      .map((row) => ({
        ...row,
        revenue: Number.parseFloat(row["revenue"] || "0"),
        customer_age: Number.parseInt(row["customer_age"] || "0"),
        units_sold: Number.parseFloat(row["units_sold"] || "0"),
        rating: Number.parseFloat(row["rating"] || "0"),
      }))
      .filter(
        (row) =>
          !isNaN(row.revenue) && !isNaN(row.customer_age) && !isNaN(row.units_sold) && !isNaN(row.rating),
      )
  }, [rawData, brandFilter, categoryFilter, countryFilter])

  const salesChannelData = useMemo(() => {
    const map = new Map<string, number>()
    filteredData.forEach((row) => {
      const channel = row["sales_channel"]
      if (channel) {
        map.set(channel, (map.get(channel) || 0) + row.revenue)
      }
    })
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [filteredData])

  const demographicData = useMemo(() => {
    const ageGroups = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55+": 0,
    }

    filteredData.forEach((row) => {
      const age = row.customer_age
      if (age >= 18 && age <= 24) ageGroups["18-24"] += row.revenue
      else if (age >= 25 && age <= 34) ageGroups["25-34"] += row.revenue
      else if (age >= 35 && age <= 44) ageGroups["35-44"] += row.revenue
      else if (age >= 45 && age <= 54) ageGroups["45-54"] += row.revenue
      else if (age >= 55) ageGroups["55+"] += row.revenue
    })

    return Object.entries(ageGroups).map(([name, value]) => ({ name, value }))
  }, [filteredData])

  const returnRateData = useMemo(() => {
    const categoryStats = new Map<string, { returns: number; total: number }>()
    filteredData.forEach((row) => {
      const category = row["category"]
      if (category) {
        if (!categoryStats.has(category)) {
          categoryStats.set(category, { returns: 0, total: 0 })
        }
        const stats = categoryStats.get(category)!
        stats.total += row.units_sold
        // Calculate returns based on the 'returned' column
        if (row["returned"] === "Yes") {
          stats.returns += row.units_sold
        }
      }
    })
    return Array.from(categoryStats.entries())
      .map(([category, stats]) => ({ category, returns: stats.returns, total: stats.total }))
      .filter((d) => d.total > 0)
  }, [filteredData])

  const uniqueBrands = useMemo(() => {
    const brands = new Set(rawData.map((row) => row["brand_name"]).filter(Boolean))
    return Array.from(brands).sort()
  }, [rawData])

  const uniqueCategories = useMemo(() => {
    const categories = new Set(rawData.map((row) => row["category"]).filter(Boolean))
    return Array.from(categories).sort()
  }, [rawData])

  const uniqueCountries = useMemo(() => {
    const countries = new Set(rawData.map((row) => row["country"]).filter(Boolean))
    return Array.from(countries).sort()
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Interactive Analytics</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="brand-filter">Filter by Brand</Label>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger id="brand-filter">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {uniqueBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category-filter">Filter by Category</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="country-filter">Filter by Country</Label>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger id="country-filter">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {uniqueCountries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCartIcon className="h-5 w-5 text-blue-500" />
              Sales Channel Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesChannelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-green-500" />
              Customer Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographicData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {demographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StarIcon className="h-5 w-5 text-orange-500" />
            Return Rate by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={returnRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="category" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    value,
                    name === 'returns' ? 'Returns' : 'Total Units'
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="returns" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
