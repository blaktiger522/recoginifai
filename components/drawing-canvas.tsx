"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"

interface DrawingCanvasProps {
  onRecognition: (text: string, confidence: number) => void
  onProcessing: (processing: boolean) => void
  isProcessing: boolean
}

export default function DrawingCanvas({ onRecognition, onProcessing, isProcessing }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.parentElement?.getBoundingClientRect()
    if (rect) {
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.width * (2 / 3) * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    // Set drawing style
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "#3B82F6"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    setContext(ctx)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !context) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    context.beginPath()
    context.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    context.lineTo(x, y)
    context.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas || !context) return
    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  const recognizeText = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    onProcessing(true)

    // Simulate API call for character recognition
    setTimeout(() => {
      // Mock recognition result
      const mockResults = [
        { text: "Hello", confidence: 0.95 },
        { text: "World", confidence: 0.92 },
        { text: "Python", confidence: 0.88 },
        { text: "JavaScript", confidence: 0.91 },
      ]

      const result = mockResults[Math.floor(Math.random() * mockResults.length)]
      onRecognition(result.text, result.confidence)
      onProcessing(false)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-white rounded-lg border-2 border-border shadow-md overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full cursor-crosshair touch-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={clearCanvas}
          className="flex-1 py-3 px-4 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={recognizeText}
          disabled={isProcessing}
          className="flex-1 py-3 px-4 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {isProcessing ? "⏳ Recognizing..." : "✓ Recognize"}
        </button>
      </div>
    </div>
  )
}
