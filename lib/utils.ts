import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format as formatDateFns, isValid, parseISO } from "date-fns"

/**
 * Utility function to merge Tailwind CSS classes
 * Handles conflicts and ensures proper class precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Date formatting utilities
 * Handles various input formats and provides consistent error handling
 */

/**
 * Formats a date into "MMM d, yyyy" format (e.g., "Mar 15, 2023")
 * @param dateInput - Date string, Date object, or undefined
 * @returns Formatted date string or fallback text
 */
export function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "N/A"

  try {
    const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput

    if (!isValid(date)) {
      console.warn("Invalid date provided to formatDate:", dateInput)
      return "Invalid Date"
    }

    return formatDateFns(date, "MMM d, yyyy")
  } catch (error) {
    console.error("Error formatting date:", dateInput, error)
    return "Invalid Date"
  }
}

/**
 * Formats a date into "MMM d" format (e.g., "Mar 15")
 * @param dateInput - Date string, Date object, or undefined
 * @returns Formatted short date string or fallback text
 */
export function formatShortDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "N/A"

  try {
    const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput

    if (!isValid(date)) {
      console.warn("Invalid date provided to formatShortDate:", dateInput)
      return "Invalid Date"
    }

    return formatDateFns(date, "MMM d")
  } catch (error) {
    console.error("Error formatting short date:", dateInput, error)
    return "Invalid Date"
  }
}

/**
 * Formats a date with time into "MMM d, yyyy, h:mm a" format
 * @param dateInput - Date string, Date object, or undefined
 * @returns Formatted datetime string or fallback text
 */
export function formatDateTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "N/A"

  try {
    const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput

    if (!isValid(date)) {
      console.warn("Invalid date provided to formatDateTime:", dateInput)
      return "Invalid Date"
    }

    return formatDateFns(date, "MMM d, yyyy, h:mm a")
  } catch (error) {
    console.error("Error formatting datetime:", dateInput, error)
    return "Invalid Date"
  }
}

/**
 * Formats a date with time into "MMM d, h:mm a" format
 * @param dateInput - Date string, Date object, or undefined
 * @returns Formatted short datetime string or fallback text
 */
export function formatShortDateTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "N/A"

  try {
    const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput

    if (!isValid(date)) {
      console.warn("Invalid date provided to formatShortDateTime:", dateInput)
      return "Invalid Date"
    }

    return formatDateFns(date, "MMM d, h:mm a")
  } catch (error) {
    console.error("Error formatting short datetime:", dateInput, error)
    return "Invalid Date"
  }
}

/**
 * Number formatting utilities
 */

/**
 * Formats a number as currency (USD)
 * @param amount - Number to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

/**
 * Formats a number as a percentage
 * @param value - Number between 0-100
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Formats large numbers with appropriate suffixes (K, M, B)
 * @param num - Number to format
 * @returns Formatted number string with suffix
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`
  }
  return num.toString()
}

/**
 * String utilities
 */

/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}...`
}

/**
 * Validation utilities
 */

/**
 * Checks if a string is a valid email address
 * @param email - Email string to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Debounce utility for limiting function calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Sleep utility for async operations
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
