"use client"

import { useState, useEffect } from "react"
import { parseCSV } from "@/lib/csv-parser"

export function useCsvData(filePath: string) {
  const [data, setData] = useState<Record<string, string>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSampled, setIsSampled] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        setIsSampled(false)
        console.log("Fetching CSV data from:", filePath)
        
        // Add timeout for large files
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
        
        const response = await fetch(filePath, {
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        console.log("Response status:", response.status)
        console.log("Response ok:", response.ok)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const text = await response.text()
        console.log("CSV text length:", text.length)
        console.log("First 500 characters:", text.substring(0, 500))
        
        if (!text || text.trim().length === 0) {
          throw new Error("CSV file is empty")
        }
        
        // For very large files, use sampling
        if (text.length > 5000000) { // 5MB threshold
          console.log("Very large file detected, using sampling...")
          const sampledData = await sampleLargeCSV(text)
          setData(sampledData)
          setIsSampled(true)
        } else if (text.length > 1000000) { // 1MB threshold
          console.log("Large file detected, processing in chunks...")
          const chunkedData = await processLargeCSV(text)
          setData(chunkedData)
        } else {
          const parsedData = await parseCSV(text)
          console.log("Parsed data length:", parsedData.length)
          console.log("First row:", parsedData[0])
          setData(parsedData)
        }
      } catch (e: any) {
        console.error("Error loading CSV data:", e)
        if (e.name === 'AbortError') {
          setError("Request timed out. The CSV file is too large to process.")
        } else {
          setError(e.message || "Failed to fetch or parse CSV data.")
        }
        setData([]) // Clear data on error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filePath])

  return { data, loading, error, isSampled }
}

async function processLargeCSV(csvText: string): Promise<Record<string, string>[]> {
  return new Promise((resolve) => {
    // Use setTimeout to avoid blocking the main thread
    setTimeout(async () => {
      try {
        const parsedData = await parseCSV(csvText)
        console.log("Large file processing complete. Data length:", parsedData.length)
        resolve(parsedData)
      } catch (error) {
        console.error("Error processing large CSV:", error)
        resolve([])
      }
    }, 0)
  })
}

async function sampleLargeCSV(csvText: string): Promise<Record<string, string>[]> {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const lines = csvText.trim().split("\n")
        if (lines.length <= 1) {
          resolve([])
          return
        }

        const headers = lines[0].split(",").map((header) => header.trim().replace(/"/g, ""))
        const result: Record<string, string>[] = []
        
        // Sample every 10th row to reduce size
        const sampleRate = 10
        for (let i = 1; i < lines.length; i += sampleRate) {
          const currentLine = lines[i].trim()
          if (!currentLine) continue

          try {
            const values = parseCSVLine(currentLine)
            if (values.length === headers.length) {
              const rowData: Record<string, string> = {}
              headers.forEach((header, index) => {
                rowData[header] = values[index] || ""
              })
              result.push(rowData)
            }
          } catch (error) {
            console.warn(`Error parsing sampled row ${i + 1}:`, error)
          }
        }

        console.log(`Sampled CSV complete. Sample size: ${result.length} rows`)
        resolve(result)
      } catch (error) {
        console.error("Error sampling large CSV:", error)
        resolve([])
      }
    }, 0)
  })
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
    
    i++
  }
  
  // Add the last field
  result.push(current.trim())
  
  // Remove quotes from all fields
  return result.map(field => field.replace(/^"|"$/g, ""))
}
