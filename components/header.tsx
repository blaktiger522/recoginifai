"use client"

import Link from "next/link"
import NavMenu from "./nav-menu"

interface HeaderProps {
  onHistoryClick: () => void
  hasHistory: boolean
}

export default function Header({ onHistoryClick, hasHistory }: HeaderProps) {
  return (
    <header className="bg-background border-b border-border py-6 md:py-8 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-foreground">ClarifAI</h1>
          </Link>

          {/* Navigation Buttons */}
          <NavMenu onHistoryClick={onHistoryClick} hasHistory={hasHistory} />
        </div>
      </div>
    </header>
  )
}
