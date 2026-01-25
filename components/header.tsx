"use client"

import Link from "next/link"
import NavMenu from "./nav-menu"

interface HeaderProps {
  onHistoryClick: () => void
  hasHistory: boolean
}

export default function Header({ onHistoryClick, hasHistory }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground py-8 md:py-10 border-b border-border/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between gap-4 md:gap-5">
          <Link href="/" className="flex items-center gap-4 md:gap-5 hover:opacity-90 transition-opacity">
            <div className="text-4xl md:text-5xl">✨</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">ClarifAI</h1>
              <p className="text-sm md:text-base opacity-90 font-medium">Intelligent Character Recognition</p>
            </div>
          </Link>

          {/* Navigation Buttons */}
          <NavMenu onHistoryClick={onHistoryClick} hasHistory={hasHistory} />
        </div>
      </div>
    </header>
  )
}
