export function parseCSV(csvString: string): Record<string, string>[] {
  const lines = csvString.trim().split("\n")
  if (lines.length === 0) {
    return []
  }

  const headers = lines[0].split(",").map((header) => header.trim().replace(/"/g, ""))
  const result: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].trim()
    if (!currentLine) continue

    // Simple CSV parsing: split by comma, handle quoted fields if necessary
    // This simple split might break if commas exist within quoted fields.
    // For robust parsing, a dedicated CSV library would be better.
    const values = currentLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((value) => value.trim().replace(/"/g, ""))

    if (values.length !== headers.length) {
      console.warn(
        `Skipping row ${i + 1} due to mismatch in column count. Expected ${headers.length}, got ${values.length}. Row: ${currentLine}`,
      )
      continue
    }

    const rowData: Record<string, string> = {}
    headers.forEach((header, index) => {
      rowData[header] = values[index]
    })
    result.push(rowData)
  }

  return result
}
