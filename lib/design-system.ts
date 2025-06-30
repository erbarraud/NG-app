/**
 * Neural Grader Design System
 *
 * Centralized design tokens and patterns for consistent UI across the application.
 * This file defines the visual language and interaction patterns used throughout.
 */

// =============================================================================
// SPACING SYSTEM
// =============================================================================
export const SPACING = {
  // Base spacing scale (rem units)
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  "2xl": "2rem", // 32px
  "3xl": "3rem", // 48px
  "4xl": "4rem", // 64px

  // Component-specific spacing
  component: {
    padding: {
      button: "0.5rem 1rem",
      input: "0.5rem 0.75rem",
      card: "1.5rem",
      section: "2rem",
    },
    gap: {
      tight: "0.5rem",
      normal: "1rem",
      loose: "1.5rem",
      section: "2rem",
    },
  },
} as const

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================
export const TYPOGRAPHY = {
  // Font families
  fonts: {
    sans: ["Inter", "system-ui", "sans-serif"],
    mono: ["JetBrains Mono", "Consolas", "monospace"],
  },

  // Font sizes and line heights
  scale: {
    xs: { size: "0.75rem", lineHeight: "1rem" }, // 12px/16px
    sm: { size: "0.875rem", lineHeight: "1.25rem" }, // 14px/20px
    base: { size: "1rem", lineHeight: "1.5rem" }, // 16px/24px
    lg: { size: "1.125rem", lineHeight: "1.75rem" }, // 18px/28px
    xl: { size: "1.25rem", lineHeight: "1.75rem" }, // 20px/28px
    "2xl": { size: "1.5rem", lineHeight: "2rem" }, // 24px/32px
    "3xl": { size: "1.875rem", lineHeight: "2.25rem" }, // 30px/36px
    "4xl": { size: "2.25rem", lineHeight: "2.5rem" }, // 36px/40px
  },

  // Semantic text styles
  styles: {
    h1: "text-3xl font-bold tracking-tight",
    h2: "text-2xl font-semibold tracking-tight",
    h3: "text-xl font-semibold",
    h4: "text-lg font-medium",
    body: "text-base",
    caption: "text-sm text-muted-foreground",
    label: "text-sm font-medium",
    code: "font-mono text-sm",
  },
} as const

// =============================================================================
// BUTTON SYSTEM
// =============================================================================
export const BUTTON_VARIANTS = {
  // Size variants
  sizes: {
    sm: "h-8 px-3 text-sm",
    default: "h-9 px-4 py-2",
    lg: "h-10 px-6",
    icon: "h-9 w-9",
    "icon-sm": "h-8 w-8",
    "icon-lg": "h-10 w-10",
  },

  // Style variants
  styles: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  },

  // Common button patterns
  patterns: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  },
} as const

// =============================================================================
// FORM SYSTEM
// =============================================================================
export const FORM_STYLES = {
  // Input styles
  input: {
    base: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    error: "border-destructive focus-visible:ring-destructive",
  },

  // Label styles
  label: {
    base: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    required: 'after:content-["*"] after:ml-0.5 after:text-destructive',
  },

  // Form layout
  layout: {
    field: "space-y-2",
    group: "space-y-4",
    section: "space-y-6",
  },
} as const

// =============================================================================
// TABLE SYSTEM
// =============================================================================
export const TABLE_STYLES = {
  // Table structure
  container: "relative w-full overflow-auto",
  table: "w-full caption-bottom text-sm",

  // Header styles
  header: {
    row: "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
    cell: "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  },

  // Body styles
  body: {
    row: "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
    cell: "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  },

  // Interactive states
  states: {
    hover: "hover:bg-muted/50",
    selected: "bg-muted",
    clickable: "cursor-pointer",
  },
} as const

// =============================================================================
// CARD SYSTEM
// =============================================================================
export const CARD_STYLES = {
  // Base card styles
  base: "rounded-lg border bg-card text-card-foreground shadow-sm",

  // Card sections
  header: "flex flex-col space-y-1.5 p-6",
  content: "p-6 pt-0",
  footer: "flex items-center p-6 pt-0",

  // Card variants
  variants: {
    default: "bg-card",
    elevated: "shadow-md",
    interactive: "hover:shadow-md transition-shadow cursor-pointer",
  },
} as const

// =============================================================================
// STATUS SYSTEM
// =============================================================================
export const STATUS_STYLES = {
  // Status colors and styles
  variants: {
    success: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
    warning:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
    error: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    info: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    neutral: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800",
  },

  // Badge styles
  badge:
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
} as const

// =============================================================================
// LAYOUT SYSTEM
// =============================================================================
export const LAYOUT = {
  // Container sizes
  container: {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  },

  // Common layout patterns
  patterns: {
    page: "container mx-auto p-4 sm:p-6",
    section: "space-y-6",
    grid: {
      responsive: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
      auto: "grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6",
    },
    flex: {
      between: "flex items-center justify-between",
      center: "flex items-center justify-center",
      start: "flex items-center justify-start",
    },
  },
} as const

// =============================================================================
// ANIMATION SYSTEM
// =============================================================================
export const ANIMATIONS = {
  // Transition durations
  duration: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
  },

  // Easing functions
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Common animation classes
  classes: {
    fadeIn: "animate-in fade-in-0 duration-200",
    slideIn: "animate-in slide-in-from-bottom-2 duration-200",
    scaleIn: "animate-in zoom-in-95 duration-200",
  },
} as const

// =============================================================================
// RESPONSIVE BREAKPOINTS
// =============================================================================
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Combines design system classes with custom classes
 */
export function combineClasses(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}

/**
 * Gets responsive classes for different breakpoints
 */
export function getResponsiveClasses(base: string, sm?: string, md?: string, lg?: string, xl?: string): string {
  const classes = [base]
  if (sm) classes.push(`sm:${sm}`)
  if (md) classes.push(`md:${md}`)
  if (lg) classes.push(`lg:${lg}`)
  if (xl) classes.push(`xl:${xl}`)
  return classes.join(" ")
}

/**
 * Gets status variant classes
 */
export function getStatusClasses(variant: keyof typeof STATUS_STYLES.variants): string {
  return combineClasses(STATUS_STYLES.badge, STATUS_STYLES.variants[variant])
}
