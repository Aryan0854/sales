"use client"

import { useState, useEffect } from "react"
import { parseCSV } from "@/lib/csv-parser"

export function useCsvData(filePath: string) {
  const [data, setData] = useState<Record<string, string>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(filePath)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const text = await response.text()
        const parsedData = parseCSV(text)
        setData(parsedData)
      } catch (e: any) {
        setError(e.message || "Failed to fetch or parse CSV data.")
        setData([]) // Clear data on error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filePath])

  return { data, loading, error }
}
