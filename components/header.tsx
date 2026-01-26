"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface HeaderProps {
  onHistoryClick: () => void
  hasHistory: boolean
}

export default function Header({ onHistoryClick, hasHistory }: HeaderProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">ClarifAI</h1>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                isActive("/")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className={`font-medium transition-colors ${
                isActive("/gallery")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Gallery
            </Link>
            <Link
              href="/settings"
              className={`font-medium transition-colors ${
                isActive("/settings")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
