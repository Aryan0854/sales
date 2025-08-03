"use client"

import { OverviewDashboard } from "@/components/overview-dashboard"
import { useCsvData } from "@/hooks/use-csv-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const { data, loading, error, isSampled } = useCsvData("/data/Ecommerce_MultiBrand_Sales_RealBrands.csv")
  const [testResult, setTestResult] = useState<string>("")
  const [componentError, setComponentError] = useState<string | null>(null)

  const testFileAccess = async () => {
    try {
      setTestResult("Testing file access...")
      const response = await fetch("/data/Ecommerce_MultiBrand_Sales_RealBrands.csv")
      setTestResult(`Status: ${response.status}, OK: ${response.ok}`)
      
      if (response.ok) {
        const text = await response.text()
        setTestResult(`File accessible! Size: ${text.length} characters. First 200 chars: ${text.substring(0, 200)}...`)
      } else {
        setTestResult(`File not accessible. Status: ${response.status}`)
      }
    } catch (err: any) {
      setTestResult(`Error: ${err.message}`)
    }
  }

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
        
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <Button onClick={testFileAccess} className="mb-2">
            Test File Access
          </Button>
          {testResult && (
            <div className="bg-white p-2 rounded text-sm">
              <pre>{testResult}</pre>
            </div>
          )}
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Troubleshooting steps:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Check if the CSV file exists in the public/data directory</li>
            <li>Verify the file is not corrupted</li>
            <li>Check browser console for additional error details</li>
            <li>Try refreshing the page</li>
          </ul>
        </div>
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
      
      {componentError && (
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Component Error: {componentError}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Data Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total records loaded: {data.length}</p>
            <p>First record: {JSON.stringify(data[0], null, 2)}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <OverviewDashboard rawData={data} />
      </div>
    </div>
  )
}
