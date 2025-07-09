"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { Toast, ToastTitle, ToastDescription, ToastClose } from "@/app/shared/ui/toast"
import { ToastViewport } from "@/app/shared/ui/toast-viewport"

export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastProps {
  id: string
  title: string
  description?: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])

    // Auto-dismiss toast after duration
    if (toast.duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastViewport>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            description={toast.description}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          >
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
            <ToastClose />
          </Toast>
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
