export async function parseCSV(csvString: string): Promise<Record<string, string>[]> {
  console.log("Starting CSV parsing...")
  console.log("Input string length:", csvString.length)
  
  if (!csvString || csvString.trim().length === 0) {
    console.warn("Empty CSV string provided")
    return []
  }

  const lines = csvString.trim().split("\n")
  console.log("Total lines:", lines.length)
  
  if (lines.length === 0) {
    console.warn("No lines found in CSV")
    return []
  }

  // Parse headers
  const headerLine = lines[0]
  console.log("Header line:", headerLine)
  
  const headers = headerLine.split(",").map((header) => header.trim().replace(/"/g, ""))
  console.log("Parsed headers:", headers)
  console.log("Number of headers:", headers.length)
  
  const result: Record<string, string>[] = []
  let skippedRows = 0
  let processedRows = 0

  // Process in smaller chunks for large files
  const chunkSize = 1000
  const totalChunks = Math.ceil((lines.length - 1) / chunkSize)
  
  for (let chunk = 0; chunk < totalChunks; chunk++) {
    const startIndex = chunk * chunkSize + 1 // Skip header
    const endIndex = Math.min(startIndex + chunkSize, lines.length)
    
    console.log(`Processing chunk ${chunk + 1}/${totalChunks} (lines ${startIndex}-${endIndex})`)
    
    for (let i = startIndex; i < endIndex; i++) {
      const currentLine = lines[i].trim()
      if (!currentLine) {
        skippedRows++
        continue
      }

      try {
        // Improved CSV parsing with better quote handling
        const values = parseCSVLine(currentLine)
        
        if (values.length !== headers.length) {
          console.warn(
            `Skipping row ${i + 1} due to mismatch in column count. Expected ${headers.length}, got ${values.length}. Row: ${currentLine.substring(0, 100)}...`,
          )
          skippedRows++
          continue
        }

        const rowData: Record<string, string> = {}
        headers.forEach((header, index) => {
          rowData[header] = values[index] || ""
        })
        result.push(rowData)
        processedRows++
      } catch (error) {
        console.warn(`Error parsing row ${i + 1}:`, error)
        skippedRows++
      }
    }
    
    // Allow other tasks to run between chunks
    if (chunk < totalChunks - 1) {
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }

  console.log(`CSV parsing complete. Processed: ${processedRows}, Skipped: ${skippedRows}`)
  return result
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
