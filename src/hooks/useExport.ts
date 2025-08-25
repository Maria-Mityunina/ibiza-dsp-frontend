import { useState } from 'react'

export type ExportFormat = 'csv' | 'xlsx' | 'pdf'

interface ExportOptions {
  format: ExportFormat
  includeCharts?: boolean
  dateRange?: string
}

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false)

  const exportData = async (data: any[], filename: string, options: ExportOptions = { format: 'csv' }) => {
    setIsExporting(true)
    
    try {
      // Симуляция экспорта данных
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (options.format === 'csv') {
        const csvContent = convertToCSV(data)
        downloadFile(csvContent, `${filename}.csv`, 'text/csv')
      } else if (options.format === 'xlsx') {
        // Здесь можно добавить библиотеку для Excel
        console.log('Excel export not implemented yet')
      } else if (options.format === 'pdf') {
        // Здесь можно добавить библиотеку для PDF
        console.log('PDF export not implemented yet')
      }
      
      return { success: true }
    } catch (error) {
      console.error('Export failed:', error)
      return { success: false, error }
    } finally {
      setIsExporting(false)
    }
  }

  const convertToCSV = (data: any[]) => {
    if (!data.length) return ''
    
    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header]
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      }).join(','))
    ]
    
    return csvRows.join('\n')
  }

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  return {
    exportData,
    isExporting
  }
}
