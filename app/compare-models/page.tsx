"use client"

import { CompareModels } from "@/components/compare-models"
import { useCsvData } from "@/hooks/use-csv-data"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function CompareModelsPage() {
  const { data, loading, error, isSampled } = useCsvData("/data/Ecommerce_MultiBrand_Sales_RealBrands.csv")

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
        <h2 className="text-xl font-bold mb-4">Error loading data</h2>
        <p className="mb-2">Error: {error}</p>
        <p className="mb-4">Please ensure 'public/data/Ecommerce_MultiBrand_Sales_RealBrands.csv' exists and is correctly formatted.</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex-1 p-4 md:p-8 text-muted-foreground">
        <h2 className="text-xl font-bold mb-4">No Data Available</h2>
        <p>No data available from the CSV file.</p>
        <p className="mt-2">Data length: {data?.length || 0}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      {isSampled && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            The CSV file is very large (5MB+). Showing sampled data (every 10th row) for better performance. 
            Total records: {data.length}
          </AlertDescription>
        </Alert>
      )}
      <CompareModels rawData={data} />
    </div>
  )
}
