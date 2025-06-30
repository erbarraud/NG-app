"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PAGINATION } from "@/lib/constants"

interface Column<T> {
  key: string
  header: string
  cell: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyField: keyof T
  isLoading?: boolean
  error?: string
  searchPlaceholder?: string
  emptyStateProps?: {
    title: string
    description?: string
  }
  className?: string
}

/**
 * DataTable Component
 *
 * A reusable, performance-optimized data table with sorting, searching, and pagination.
 *
 * @param data - Array of data items to display
 * @param columns - Column definitions
 * @param keyField - Field to use as unique key for each row
 * @param isLoading - Whether the data is loading
 * @param error - Optional error message
 * @param searchPlaceholder - Placeholder text for search input
 * @param emptyStateProps - Configuration for empty state
 * @param className - Additional CSS classes
 */
export function DataTable<T>({
  data,
  columns,
  keyField,
  isLoading = false,
  error,
  searchPlaceholder = "Search...",
  emptyStateProps = {
    title: "No data found",
    description: "Try adjusting your search or filters.",
  },
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }, [])

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("")
    setCurrentPage(1)
  }, [])

  // Handle sort
  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
      } else {
        setSortField(field)
        setSortDirection("asc")
      }
    },
    [sortField, sortDirection],
  )

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    // First filter the data
    let result = [...data]

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      result = result.filter((item) => {
        return Object.values(item).some((value) => {
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(lowerCaseQuery)
        })
      })
    }

    // Then sort the data
    if (sortField) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortField]
        const bValue = (b as any)[sortField]

        if (aValue === bValue) return 0

        const comparison = aValue < bValue ? -1 : 1
        return sortDirection === "asc" ? comparison : -comparison
      })
    }

    return result
  }, [data, searchQuery, sortField, sortDirection])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize)
  }, [filteredAndSortedData, currentPage, pageSize])

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedData.length / pageSize)
  }, [filteredAndSortedData.length, pageSize])

  // Pagination controls
  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    },
    [totalPages],
  )

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinner text="Loading data..." />
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-8 pr-8"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.sortable ? "cursor-pointer select-none" : ""}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && sortField === column.key && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={String(item[keyField])}>
                  {columns.map((column) => (
                    <TableCell key={`${String(item[keyField])}-${column.key}`}>{column.cell(item)}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <EmptyState title={emptyStateProps.title} description={emptyStateProps.description} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredAndSortedData.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {paginatedData.length} of {filteredAndSortedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => goToPage(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
