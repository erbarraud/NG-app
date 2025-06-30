"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChromeIcon, EyeIcon, EyeOffIcon, LogInIcon } from "lucide-react" // Using Chrome as a generic browser/Google icon

const LoginPage = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Mock login logic
    console.log("Attempting login...")
    // Simulate API call
    setTimeout(() => {
      router.push("/overview")
    }, 500)
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Panel: Branded Visuals */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-sky-900 via-slate-900 to-slate-900 text-white p-12 overflow-hidden">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 z-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="techGrid" patternUnits="userSpaceOnUse" width="60" height="60">
                {/* Grid lines */}
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.3" />
                {/* Dots at intersections */}
                <circle cx="0" cy="0" r="0.7" fill="currentColor" />
                <circle cx="60" cy="0" r="0.7" fill="currentColor" />
                <circle cx="0" cy="60" r="0.7" fill="currentColor" />
                <circle cx="60" cy="60" r="0.7" fill="currentColor" />
              </pattern>
              {/* Subtle diagonal lines representing scanner light or data flow */}
              <pattern
                id="scanLines"
                patternUnits="userSpaceOnUse"
                width="200"
                height="200"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="200" stroke="currentColor" strokeWidth="10" strokeOpacity="0.3" />
                <line x1="50" y1="0" x2="50" y2="200" stroke="currentColor" strokeWidth="5" strokeOpacity="0.2" />
                <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="10" strokeOpacity="0.3" />
                <line x1="150" y1="0" x2="150" y2="200" stroke="currentColor" strokeWidth="5" strokeOpacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#scanLines)" opacity="0.3" />
            <rect width="100%" height="100%" fill="url(#techGrid)" />
          </svg>
        </div>

        {/* Abstract shapes for depth - optional */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-sky-700/30 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-sky-600/30 rounded-full filter blur-3xl opacity-40 animate-pulse-slower"></div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <Link href="/" className="mb-10">
            <Image
              src="/images/neural-grader-logo.png" // Assuming this is the standard logo
              alt="Neural Grader Logo"
              width={240} // Adjusted size
              height={54} // Adjusted size
              className="mx-auto filter brightness-0 invert" // Makes the logo white
              priority
            />
          </Link>
          <h1 className="text-4xl font-bold mb-4 leading-tight">Unlock Precision. Maximize Value.</h1>
          <p className="text-lg text-sky-100/80 mb-12">Neural Grader: AI-powered insights for the timber industry.</p>
          {/* You could add a small graphic or illustration here if available */}
        </div>
        <p className="absolute bottom-8 text-sm text-sky-100/60 z-10">
          © {currentYear} Neural Grader. All rights reserved.
        </p>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-slate-50 dark:bg-slate-950">
        {/* Mobile Header */}
        <div className="lg:hidden mb-8 text-center">
          <Link href="/">
            <Image
              src="/images/neural-grader-logo.png"
              alt="Neural Grader Logo"
              width={180}
              height={40.5}
              className="mx-auto dark:filter dark:brightness-0 dark:invert" // Invert for dark mode if logo isn't white by default
            />
          </Link>
        </div>

        <div className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-xl shadow-2xl">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="h-11 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800/50"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="h-11 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Checkbox id="remember-me" className="border-slate-400 dark:border-slate-600" />
                <Label htmlFor="remember-me" className="font-normal text-slate-600 dark:text-slate-400">
                  Remember me
                </Label>
              </div>
              <Link href="#" className="font-medium text-primary hover:text-primary/80 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <LogInIcon className="mr-2 h-5 w-5" /> Login
              </Button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          <div>
            <Button
              variant="outline"
              className="w-full h-11 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <ChromeIcon className="mr-2 h-5 w-5" />
              Login with Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="#" className="font-medium text-primary hover:text-primary/80 hover:underline">
              Create account
            </Link>
          </p>
        </div>
        <p className="lg:hidden mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          © {currentYear} Neural Grader. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
