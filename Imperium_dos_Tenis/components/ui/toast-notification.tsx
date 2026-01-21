"use client"

import { useEffect } from "react"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToastNotificationProps {
  message: string
  isVisible: boolean
  onClose: () => void
  type?: "success" | "error" | "info"
}

export function ToastNotification({ message, isVisible, onClose, type = "success" }: ToastNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <div
        className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border max-w-sm ${
          type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
        }`}
      >
        {type === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
        <p className="text-sm font-medium flex-1">{message}</p>
        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-transparent" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
