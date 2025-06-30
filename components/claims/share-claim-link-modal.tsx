"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Link, Mail } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ShareClaimLinkModalProps {
  onClose: () => void
  claimId?: string
}

export function ShareClaimLinkModal({ onClose, claimId = "new" }: ShareClaimLinkModalProps) {
  const [generatedLink, setGeneratedLink] = useState("")
  const [copied, setCopied] = useState(false)

  // Generate a link automatically when the modal opens
  useEffect(() => {
    // In a real app, this would call an API to generate a secure token
    const token = Math.random().toString(36).substring(2, 15)
    const link = `https://neural-grader.com/claim/${claimId}-${token}`
    setGeneratedLink(link)
  }, [claimId])

  // Add this function to provide a fallback copy method
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea")
    textArea.value = text

    // Make the textarea out of viewport
    textArea.style.position = "fixed"
    textArea.style.left = "-999999px"
    textArea.style.top = "-999999px"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand("copy")
      if (successful) {
        setCopied(true)
        toast({
          title: "Link Copied",
          description: "The claim link has been copied to your clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
      } else {
        toast({
          title: "Copy Failed",
          description: "Could not copy to clipboard. Please try again.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err)
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }

    document.body.removeChild(textArea)
  }

  // Copy link to clipboard
  const copyLink = () => {
    if (!generatedLink) return

    try {
      navigator.clipboard
        .writeText(generatedLink)
        .then(() => {
          setCopied(true)
          toast({
            title: "Link Copied",
            description: "The claim link has been copied to your clipboard",
          })

          setTimeout(() => setCopied(false), 2000)
        })
        .catch((err) => {
          console.error("Failed to copy: ", err)
          toast({
            title: "Copy Failed",
            description: "Could not copy to clipboard. Please try again.",
            variant: "destructive",
          })
        })
    } catch (err) {
      console.error("Clipboard API not available: ", err)
      // If Clipboard API is not available, use the fallback
      fallbackCopyTextToClipboard(generatedLink)
    }
  }

  // Send link via email
  const sendEmail = () => {
    if (!generatedLink) return

    // In a real app, this would open an email client or call an API
    window.open(`mailto:?subject=Submit a Claim&body=Please use this link to submit your claim: ${generatedLink}`)

    toast({
      title: "Email Opened",
      description: "Please complete the email in your mail client",
    })
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Share Claim Submission Link</h3>
        <p className="text-sm text-muted-foreground">
          Share this link with your customer to allow them to submit a claim
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Input value={generatedLink} readOnly className="flex-1" />
        <Button variant="outline" size="icon" onClick={copyLink}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>

      {copied && <p className="text-xs text-green-600 text-center">Copied to clipboard!</p>}

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1 flex items-center justify-center gap-2" onClick={copyLink}>
          <Link className="h-4 w-4" />
          Copy Link
        </Button>
        <Button variant="outline" className="flex-1 flex items-center justify-center gap-2" onClick={sendEmail}>
          <Mail className="h-4 w-4" />
          Send via Email
        </Button>
      </div>

      <div className="pt-2">
        <Button variant="default" className="w-full" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  )
}
