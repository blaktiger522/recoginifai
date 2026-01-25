"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/header"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "auto",
    language: "english",
    exportFormat: "txt",
    autoSave: true,
    notifications: true,
  })

  const [savedMessage, setSavedMessage] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("clarifi_settings")
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch {
        console.error("Failed to load settings")
      }
    }
  }, [])

  const handleSettingChange = (key: string, value: any) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    localStorage.setItem("clarifi_settings", JSON.stringify(updated))
    setSavedMessage("Settings saved!")
    setTimeout(() => setSavedMessage(""), 2000)
  }

  const clearAllData = () => {
    if (window.confirm("Are you sure? This will delete all saved documents and settings.")) {
      localStorage.removeItem("clarifi_history")
      localStorage.removeItem("clarifi_settings")
      window.location.href = "/"
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onHistoryClick={() => {}} hasHistory={false} />

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <button className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2 mb-4">
              <span>←</span> Back to Scanner
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your ClarifAI experience</p>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm font-semibold flex items-center gap-2">
            <span>✓</span> {savedMessage}
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span>🎨</span> Appearance
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange("theme", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="auto">Auto (System)</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recognition */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span>🔍</span> Recognition
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange("language", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="arabic">Arabic</option>
                  <option value="chinese">Chinese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Default Export Format</label>
                <select
                  value={settings.exportFormat}
                  onChange={(e) => handleSettingChange("exportFormat", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="txt">Text (.txt)</option>
                  <option value="pdf">PDF (.pdf)</option>
                  <option value="docx">Word (.docx)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span>⚙️</span> Preferences
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => handleSettingChange("autoSave", e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <span className="text-foreground font-medium">Auto-save results</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange("notifications", e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <span className="text-foreground font-medium">Enable notifications</span>
              </label>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span>💾</span> Data Management
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Manage your stored documents and application data</p>
            <button
              onClick={clearAllData}
              className="w-full px-4 py-3 rounded-lg bg-destructive/10 text-destructive font-semibold hover:bg-destructive/20 transition-colors flex items-center gap-2 justify-center"
            >
              <span>🗑️</span> Clear All Data
            </button>
          </div>

          {/* About */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span>ℹ️</span> About
            </h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">ClarifAI v1.0</span> - Intelligent Character Recognition
              </p>
              <p>Transform unclear handwriting and documents into clear, editable text.</p>
              <p className="pt-2">Powered by Nanonets OCR 2</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
