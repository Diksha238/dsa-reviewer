import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DSA Reviewer — FANG-Style Code Analysis',
  description: 'Get instant AI-powered feedback on your DSA solutions from a simulated FANG interviewer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
