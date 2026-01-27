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

      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
        <div className="mb-12">
          <Link href="/">
            <button className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2 mb-6">
              <span>←</span> Back
            </button>
          </Link>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">Settings</h1>
            <p className="text-lg text-muted-foreground">Configure your ClarifAI experience</p>
          </div>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <div className="mb-8 p-4 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-semibold flex items-center gap-2 animate-in fade-in">
            <span>✓</span> {savedMessage}
          </div>
        )}

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Appearance */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl">
                🎨
              </div>
              <h2 className="text-2xl font-bold text-foreground">Appearance</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange("theme", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  <option value="auto">Auto (System)</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recognition */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white text-xl">
                🔍
              </div>
              <h2 className="text-2xl font-bold text-foreground">Recognition</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange("language", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white text-xl">
                💾
              </div>
              <h2 className="text-2xl font-bold text-foreground">Export</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Default Format</label>
                <select
                  value={settings.exportFormat}
                  onChange={(e) => handleSettingChange("exportFormat", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  <option value="txt">Text (.txt)</option>
                  <option value="pdf">PDF (.pdf)</option>
                  <option value="docx">Word (.docx)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl">
                ⚙️
              </div>
              <h2 className="text-2xl font-bold text-foreground">Preferences</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-5">
              <label className="flex items-center gap-4 cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => handleSettingChange("autoSave", e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary cursor-pointer"
                />
                <div>
                  <p className="text-foreground font-semibold">Auto-save results</p>
                  <p className="text-xs text-muted-foreground">Automatically save processing results to history</p>
                </div>
              </label>
              <label className="flex items-center gap-4 cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange("notifications", e.target.checked)}
                  className="w-5 h-5 rounded border-border accent-primary cursor-pointer"
                />
                <div>
                  <p className="text-foreground font-semibold">Enable notifications</p>
                  <p className="text-xs text-muted-foreground">Get notified when processing is complete</p>
                </div>
              </label>
            </div>
          </div>

          {/* Data Management */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-destructive/70 to-destructive flex items-center justify-center text-white text-xl">
                🗑️
              </div>
              <h2 className="text-2xl font-bold text-foreground">Data Management</h2>
            </div>
            <div className="bg-card border border-destructive/20 rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-4">Permanently delete all saved documents and preferences. This action cannot be undone.</p>
              <button
                onClick={clearAllData}
                className="w-full px-6 py-3 rounded-lg bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90 transition-all duration-200 active:scale-95"
              >
                Clear All Data
              </button>
            </div>
          </div>

          {/* About */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-muted-foreground to-foreground flex items-center justify-center text-card text-xl">
                ℹ️
              </div>
              <h2 className="text-2xl font-bold text-foreground">About</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground">ClarifAI v1.0</p>
                <p className="text-sm text-muted-foreground">AI-Powered Character Recognition</p>
              </div>
              <p className="text-sm text-muted-foreground">Transform unclear handwriting and documents into clear, editable text with advanced OCR technology.</p>
              <p className="text-xs text-muted-foreground pt-2 border-t border-border">Powered by Nanonets OCR 2</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
