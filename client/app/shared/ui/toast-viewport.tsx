"use client"

import { cn } from "@/app/lib/utils"
import type { ReactNode } from "react"

interface ToastViewportProps {
  children: ReactNode
  className?: string
}

export function ToastViewport({ children, className }: ToastViewportProps) {
  return (
    <div
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className,
      )}
    >
      {children}
    </div>
  )
}
