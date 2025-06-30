"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2024 Neural Grader. Built for precision lumber grading.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
