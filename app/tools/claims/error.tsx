"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ClaimsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="mr-2 h-5 w-5" />
            Error Loading Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">
            There was a problem loading the claims data. Please try again or contact support if the problem persists.
          </p>
          <div className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-32">
            <code>{error.message}</code>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
