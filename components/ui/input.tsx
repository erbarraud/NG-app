import * as React from "react"
import { cn } from "@/lib/utils"
import { FORM_STYLES } from "@/lib/design-system"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Input Component
 *
 * Unified input component following the Neural Grader design system.
 * Supports icons, error states, and consistent styling.
 *
 * @example
 * ```tsx
 * <Input placeholder="Enter text..." />
 * <Input error placeholder="Invalid input" />
 * <Input leftIcon={<Search />} placeholder="Search..." />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, ...props }, ref) => {
    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{leftIcon}</div>}
          <input
            type={type}
            className={cn(
              FORM_STYLES.input.base,
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && FORM_STYLES.input.error,
              className,
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{rightIcon}</div>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(FORM_STYLES.input.base, error && FORM_STYLES.input.error, className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
