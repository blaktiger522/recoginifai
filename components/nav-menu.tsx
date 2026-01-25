"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"

interface NavMenuProps {
  onHistoryClick: () => void
  hasHistory: boolean
}

export default function NavMenu({ onHistoryClick, hasHistory }: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const menuItems = [
    { label: "History", icon: "📋", href: null, onClick: onHistoryClick, disabled: !hasHistory },
    { label: "Gallery", icon: "🖼️", href: "/gallery", onClick: null, disabled: false },
    { label: "Settings", icon: "⚙️", href: "/settings", onClick: null, disabled: false },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center justify-center"
        title="Open menu"
        aria-label="Open menu"
      >
        <span className="text-xl">⋮</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.href ? (
                <Link href={item.href}>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-left px-4 py-3 hover:bg-accent/10 transition-colors flex items-center gap-3 font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.disabled}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-accent/10 transition-colors flex items-center gap-3 font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={item.disabled}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
