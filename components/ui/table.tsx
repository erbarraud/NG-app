import * as React from "react"
import { cn } from "@/lib/utils"
import { TABLE_STYLES } from "@/lib/design-system"

/**
 * Unified Table System
 *
 * Consistent table components following the Neural Grader design system.
 * All tables should use these components for unified styling and behavior.
 */

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className={TABLE_STYLES.container}>
      <table ref={ref} className={cn(TABLE_STYLES.table, className)} {...props} />
    </div>
  ),
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />,
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
)
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
  ),
)
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    clickable?: boolean
  }
>(({ className, clickable, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(TABLE_STYLES.body.row, clickable && TABLE_STYLES.states.clickable, className)}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    sortable?: boolean
    sorted?: "asc" | "desc" | false
  }
>(({ className, sortable, sorted, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(TABLE_STYLES.header.cell, sortable && "cursor-pointer select-none hover:bg-muted/50", className)}
    {...props}
  >
    <div className="flex items-center gap-2">
      {children}
      {sortable && (
        <span className="text-muted-foreground">{sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↕"}</span>
      )}
    </div>
  </th>
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <td ref={ref} className={cn(TABLE_STYLES.body.cell, className)} {...props} />,
)
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  ),
)
TableCaption.displayName = "TableCaption"

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
