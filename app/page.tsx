"use client"

import { OverviewDashboard } from "@/components/overview-dashboard"
import { useCsvData } from "@/hooks/use-csv-data"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const { data, loading, error } = useCsvData("/data/Ecommerce_MultiBrand_Sales_RealBrands.csv")

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-4 md:p-8 text-red-500">
        <p>Error loading data: {error}</p>
        <p>Please ensure 'public/data/Ecommerce_MultiBrand_Sales_RealBrands.csv' exists and is correctly formatted.</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex-1 p-4 md:p-8 text-muted-foreground">
        <p>No data available from the CSV file.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <OverviewDashboard rawData={data} />
    </div>
  )
}
