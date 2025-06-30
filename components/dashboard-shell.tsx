"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

// Icons
import {
  Bell,
  Layers,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  HelpCircle,
  ClipboardCheck,
  BarChart2,
  Menu,
  ChevronDown,
  Search,
  Calendar,
} from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Footer } from "@/components/footer" // Import the new Footer component

// Types
interface NavItem {
  href: string
  icon: React.ElementType
  label: string
}

interface DashboardShellProps {
  children: React.ReactNode
}

// Navigation Configuration
// Separated for easy maintenance and modification
const NAVIGATION_CONFIG = {
  main: [
    { href: "/", icon: LayoutDashboard, label: "Overview" },
    { href: "/batches", icon: Layers, label: "Orders" },
    { href: "/board-finder", icon: Search, label: "Board Finder" },
    { href: "/line-check", icon: BarChart2, label: "Line" },
  ] as NavItem[],

  tools: [
    { href: "/tools/claims", icon: ClipboardCheck, label: "Claims" },
    { href: "/tools/shift-scheduler", icon: Calendar, label: "Shift Scheduler" },
  ] as NavItem[],

  config: [
    { href: "/grading", icon: Settings, label: "Grading Rules" },
    { href: "/users", icon: Users, label: "User Management" },
  ] as NavItem[],
} as const

// Mock notifications - replace with real data source
const MOCK_NOTIFICATIONS = [
  "Batch #1234 completed with 95% accuracy",
  "System update scheduled for tomorrow",
  "New grading rule added by Admin",
]

/**
 * DashboardShell Component
 *
 * Main application layout providing:
 * - Responsive navigation (desktop dropdown + mobile menu)
 * - User authentication status
 * - Notifications system
 * - Consistent header/sidebar across all pages
 *
 * @param children - Page content to render within the shell
 */
export function DashboardShell({ children }: DashboardShellProps) {
  // Navigation state
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // UI state
  const [isScrolled, setIsScrolled] = useState(false)
  const [notificationCount] = useState(MOCK_NOTIFICATIONS.length)

  // Handle scroll effect for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Mobile menu handlers
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Memoized components to prevent unnecessary re-renders
  const NavItem = useCallback(
    ({ href, icon: Icon, label, isActive }: NavItem & { isActive: boolean }) => (
      <Link
        href={href}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary/80"
        }`}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    ),
    [],
  )

  const NavDropdown = useCallback(
    ({ label, children }: { label: string; children: React.ReactNode }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 px-3 text-sm font-medium">
            {label}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [],
  )

  // Desktop navigation menu
  const desktopNavigation = useMemo(
    () => (
      <nav className="hidden lg:flex items-center space-x-1">
        {/* Main navigation items */}
        {NAVIGATION_CONFIG.main.map((item) => (
          <NavItem key={item.href} {...item} isActive={pathname === item.href} />
        ))}

        {/* Tools dropdown */}
        <NavDropdown label="Tools">
          {[...NAVIGATION_CONFIG.tools, ...NAVIGATION_CONFIG.config].map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} className="flex items-center">
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </NavDropdown>

        {/* Support dropdown */}
        <NavDropdown label="Support">
          <DropdownMenuItem asChild>
            <Link href="/support" className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Documentation</span>
            </Link>
          </DropdownMenuItem>
        </NavDropdown>
      </nav>
    ),
    [NavItem, NavDropdown, pathname],
  )

  // Mobile navigation menu
  const mobileNavigation = useMemo(
    () =>
      isMobileMenuOpen && (
        <nav className="lg:hidden border-t border-border bg-background">
          <div className="grid grid-cols-2 gap-1 p-2">
            {/* All navigation items in mobile grid */}
            {[
              ...NAVIGATION_CONFIG.main,
              ...NAVIGATION_CONFIG.tools,
              ...NAVIGATION_CONFIG.config,
              { href: "/support", icon: HelpCircle, label: "Help & Documentation" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 p-2 text-sm rounded-md transition-colors ${
                  pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-secondary/80"
                }`}
                onClick={closeMobileMenu}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile search */}
          <div className="p-2 pt-0">
            <form className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search boards, orders..." className="w-full pl-8 shadow-none" />
            </form>
          </div>
        </nav>
      ),
    [isMobileMenuOpen, pathname, closeMobileMenu],
  )

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Fixed Header */}
      <header
        className={`sticky top-0 z-50 w-full border-b bg-secondary text-secondary-foreground transition-shadow ${
          isScrolled ? "shadow-sm" : ""
        }`}
        style={{ borderBottomColor: "#4ED586" }}
      >
        {/* Top bar with logo and actions */}
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          {/* Left: Logo and mobile menu */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/neural-grader-logo.png"
                alt="Neural Grader"
                width={140}
                height={32}
                className="h-8 w-auto filter brightness-0 invert"
                priority
              />
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Center: Desktop navigation */}
          {desktopNavigation}

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label={`Notifications (${notificationCount} unread)`}
                >
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <Badge
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
                      variant="destructive"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {MOCK_NOTIFICATIONS.map((notification, index) => (
                  <DropdownMenuItem key={index} className="whitespace-normal">
                    <span className="text-sm">{notification}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="User account menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/user-avatar-mockup.jpg" alt="User avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground">Administrator</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileNavigation}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-900/50">
        <div className="container mx-auto p-4 sm:p-6">{children}</div>
      </main>

      {/* Application Footer */}
      <Footer />
    </div>
  )
}
