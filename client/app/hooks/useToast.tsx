"use client"

import { useToast as useToastContext } from "@/contexts/toast-context"

export function useToast() {
  const { addToast, removeToast } = useToastContext()

  const toast = {
    success: (title: string, description?: string, duration?: number) => {
      addToast({ title, description, type: "success", duration })
    },
    error: (title: string, description?: string, duration?: number) => {
      addToast({ title, description, type: "error", duration })
    },
    warning: (title: string, description?: string, duration?: number) => {
      addToast({ title, description, type: "warning", duration })
    },
    info: (title: string, description?: string, duration?: number) => {
      addToast({ title, description, type: "info", duration })
    },
    dismiss: (id: string) => {
      removeToast(id)
    },
  }

  return toast
}
