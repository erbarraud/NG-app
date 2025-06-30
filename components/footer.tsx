import Link from "next/link"
import { Separator } from "@/components/ui/separator"

/**
 * Application-wide footer component.
 *
 * Displays copyright information, the current app version, and essential links.
 * Designed to be compact, on-brand, and responsive.
 */
export function Footer() {
  const currentYear = new Date().getFullYear()
  // This environment variable is automatically available in Next.js builds
  const appVersion = process.env.npm_package_version || "1.0.0"

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="text-xs text-muted-foreground sm:text-sm">
          <p>
            &copy; {currentYear} Neural Grader. All rights reserved.
            <span className="hidden sm:inline"> &middot; v{appVersion}</span>
          </p>
        </div>
        <nav className="flex items-center gap-3 sm:gap-4">
          <Link href="/terms" className="text-xs text-muted-foreground transition-colors hover:text-primary sm:text-sm">
            Terms
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link
            href="/privacy"
            className="text-xs text-muted-foreground transition-colors hover:text-primary sm:text-sm"
          >
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  )
}
