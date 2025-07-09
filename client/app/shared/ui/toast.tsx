"use client"

import { cn } from "@/app/lib/utils"
import * as React from "react"
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

export type ToastType = "success" | "error" | "info" | "warning"

interface ToastProps {
  id: string
  title: string
  description?: string
  type: ToastType
  onClose: () => void
  children?: React.ReactNode
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, title, description, type, onClose, children, ...props }, ref) => {
    const getToastStyles = () => {
      switch (type) {
        case "success":
          return "bg-green-600 text-white border-green-700"
        case "error":
          return "bg-red-600 text-white border-red-700"
        case "warning":
          return "bg-amber-500 text-white border-amber-600"
        case "info":
          return "bg-blue-600 text-white border-blue-700"
        default:
          return "bg-gray-800 text-white border-gray-700"
      }
    }

    const getIcon = () => {
      const iconClass = "h-6 w-6 flex-shrink-0"
      switch (type) {
        case "success":
          return <CheckCircle className={iconClass} />
        case "error":
          return <XCircle className={iconClass} />
        case "warning":
          return <AlertTriangle className={iconClass} />
        case "info":
          return <Info className={iconClass} />
        default:
          return <Info className={iconClass} />
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
          getToastStyles(),
        )}
        {...props}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">{children}</div>
        </div>
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    )
  },
)
Toast.displayName = "Toast"

const ToastTitle = React.forwardRef<React.ElementRef<"p">, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm font-bold leading-none tracking-tight", className)} {...props} />
  },
)
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<React.ElementRef<"p">, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm opacity-90 mt-1", className)} {...props} />
  },
)
ToastDescription.displayName = "ToastDescription"

const ToastClose = React.forwardRef<React.ElementRef<"button">, React.ComponentPropsWithoutRef<"button">>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
          className,
        )}
        {...props}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    )
  },
)
ToastClose.displayName = "ToastClose"

const ToastAction = React.forwardRef<React.ElementRef<"button">, React.ComponentPropsWithoutRef<"button">>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-8 items-center rounded-md bg-primary px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
          className,
        )}
        {...props}
      />
    )
  },
)
ToastAction.displayName = "ToastAction"

export { Toast, ToastTitle, ToastDescription, ToastClose, ToastAction }
