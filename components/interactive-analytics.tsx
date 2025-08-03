"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface InteractiveAnalyticsProps {
  rawData: Record<string, string>[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"]

export function InteractiveAnalytics({ rawData }: InteractiveAnalyticsProps) {
  const [brandFilter, setBrandFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")

  const filteredData = useMemo(() => {
    if (!rawData || rawData.length === 0) return []
    return rawData
      .filter((row) => {
        const matchesBrand =
          brandFilter !== "all" ? row["Brand Name"]?.toLowerCase().includes(brandFilter.toLowerCase()) : true
        const matchesCategory = categoryFilter !== "all" ? row["Category"] === categoryFilter : true
        const matchesCountry = countryFilter !== "all" ? row["Country"] === countryFilter : true
        return matchesBrand && matchesCategory && matchesCountry
      })
      .map((row) => ({
        ...row,
        Revenue: Number.parseFloat(row["Revenue"]),
        "Customer Age": Number.parseInt(row["Customer Age"]),
        "Units Sold": Number.parseFloat(row["Units Sold"]),
        Rating: Number.parseFloat(row["Rating"]),
      }))
      .filter(
        (row) =>
          !isNaN(row["Revenue"]) && !isNaN(row["Customer Age"]) && !isNaN(row["Units Sold"]) && !isNaN(row["Rating"]),
      )
  }, [rawData, brandFilter, categoryFilter, countryFilter])

  const salesChannelData = useMemo(() => {
    const map = new Map<string, number>()
    filteredData.forEach((row) => {
      const channel = row["Sales Channel"]
      if (channel) {
        map.set(channel, (map.get(channel) || 0) + row["Revenue"])
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
      const age = row["Customer Age"]
      if (age >= 18 && age <= 24) ageGroups["18-24"] += row["Revenue"]
      else if (age >= 25 && age <= 34) ageGroups["25-34"] += row["Revenue"]
      else if (age >= 35 && age <= 44) ageGroups["35-44"] += row["Revenue"]
      else if (age >= 45 && age <= 54) ageGroups["45-54"] += row["Revenue"]
      else if (age >= 55) ageGroups["55+"] += row["Revenue"]
    })

    return Object.entries(ageGroups).map(([name, value]) => ({ name, value }))
  }, [filteredData])

  const returnRateData = useMemo(() => {
    const categoryStats = new Map<string, { returns: number; total: number }>()
    filteredData.forEach((row) => {
      const category = row["Category"]
      if (category) {
        if (!categoryStats.has(category)) {
          categoryStats.set(category, { returns: 0, total: 0 })
        }
        const stats = categoryStats.get(category)!
        stats.total += row["Units Sold"]
        // This is a placeholder for actual return logic.
        // Assuming 'Returns' is a specific category or there's a 'Returned' flag.
        // For now, let's mock some return rates based on category for demonstration.
        if (category === "Apparel" && Math.random() < 0.15) stats.returns += row["Units Sold"]
        if (category === "Electronics" && Math.random() < 0.08) stats.returns += row["Units Sold"]
        if (category === "Home Goods" && Math.random() < 0.05) stats.returns += row["Units Sold"]
        if (category === "Books" && Math.random() < 0.02) stats.returns += row["Units Sold"]
      }
    })
    return Array.from(categoryStats.entries())
      .map(([category, stats]) => ({ category, returns: stats.returns, total: stats.total }))
      .filter((d) => d.total > 0)
  }, [filteredData])

  const uniqueBrands = useMemo(() => {
    const brands = new Set(rawData.map((row) => row["Brand Name"]).filter(Boolean))
    return Array.from(brands).sort()
  }, [rawData])

  const uniqueCategories = useMemo(() => {
    const categories = new Set(rawData.map((row) => row["Category"]).filter(Boolean))
    return Array.from(categories).sort()
  }, [rawData])

  const uniqueCountries = useMemo(() => {
    const countries = new Set(rawData.map((row) => row["Country"]).filter(Boolean))
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
      <h1 className="text-3xl font-bold">Interactive Analytics</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="brand-filter">Brand</Label>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger id="brand-filter">
              <SelectValue placeholder="Filter by brand" />
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
          <Label htmlFor="category-filter">Category</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Select Category" />
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
          <Label htmlFor="country-filter">Country</Label>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger id="country-filter">
              <SelectValue placeholder="Select Country" />
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Channel Comparison (Revenue)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="aspect-video h-[300px]"
            >
              <BarChart data={salesChannelData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demographic Analysis (Age Group Revenue)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="aspect-video h-[300px]"
            >
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Return Rates by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: {
                  label: "Return Rate (%)",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="aspect-video h-[300px]"
            >
              <BarChart data={returnRateData.map((d) => ({ ...d, rate: (d.returns / d.total) * 100 }))}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 20]} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="rate" fill="var(--color-rate)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Heatmap (Placeholder)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>Map visualization would go here. (Requires a mapping library)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
