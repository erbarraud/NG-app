"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ClaimForm } from "@/components/claims/claim-form"
import { CheckCircle2 } from "lucide-react"

export default function CustomerClaimPage() {
  const params = useParams()
  const token = params.token as string

  const [submitted, setSubmitted] = useState(false)
  const [claimId, setClaimId] = useState("")

  // Extract customer info from token (in a real app, this would validate the token)
  const customerInfo = token.split("-")[0]

  // Handle form submission
  const handleSubmit = (formData: any) => {
    // In a real app, this would submit to an API
    console.log("Submitting claim:", formData)

    // Generate a claim ID
    const generatedId = "CLM-" + Date.now().toString().slice(-6)
    setClaimId(generatedId)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {!submitted ? (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Submit a Claim</CardTitle>
              <CardDescription>Please provide details about your issue with the lumber batch</CardDescription>
            </CardHeader>
            <CardContent>
              <ClaimForm customerInfo={customerInfo} onSubmit={handleSubmit} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Claim Submitted Successfully</CardTitle>
              <CardDescription>Your claim has been received and will be reviewed shortly</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Claim Reference Number</p>
                <p className="text-xl font-bold">{claimId}</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-sm">
                <p>We have sent a confirmation email with your claim details.</p>
                <p className="mt-2">Our team will review your claim and contact you within 2 business days.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Submit Another Claim
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Neural Grader Claims Processing</p>
          <p>© 2023 Neural Grader. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
