import type React from "react"

interface Props {
  children: React.ReactNode
}

export default function OrderLayout({ children }: Props) {
  return <div>{children}</div>
}
