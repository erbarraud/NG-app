import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { BUTTON_VARIANTS } from "@/lib/design-system"

/**
 * Button Component Variants
 *
 * Unified button system following the Neural Grader design system.
 * All buttons across the app should use these consistent variants.
 */
const buttonVariants = cva(
  // Base button styles - consistent across all variants
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: BUTTON_VARIANTS.styles.default,
        destructive: BUTTON_VARIANTS.styles.destructive,
        outline: BUTTON_VARIANTS.styles.outline,
        secondary: BUTTON_VARIANTS.styles.secondary,
        ghost: BUTTON_VARIANTS.styles.ghost,
        link: BUTTON_VARIANTS.styles.link,
      },
      size: {
        default: BUTTON_VARIANTS.sizes.default,
        sm: BUTTON_VARIANTS.sizes.sm,
        lg: BUTTON_VARIANTS.sizes.lg,
        icon: BUTTON_VARIANTS.sizes.icon,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Button Component
 *
 * Unified button component with consistent styling, loading states, and icon support.
 *
 * @example
 * ```tsx
 * <Button variant="default" size="default">
 *   Click me
 * </Button>
 *
 * <Button variant="outline" leftIcon={<Plus />}>
 *   Add Item
 * </Button>
 *
 * <Button loading disabled>
 *   Processing...
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, leftIcon, rightIcon, children, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && leftIcon}
        {children}
        {!loading && rightIcon && rightIcon}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
