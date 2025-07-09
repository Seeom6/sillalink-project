"use client"

import * as React from "react"
import { cn } from "@/app/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "ghost" | "outline"
  size?: "sm" | "md" | "lg"
  error?: boolean
  helperText?: string
  label?: string
  required?: boolean
  maxLength?: number
  showCount?: boolean
  resize?: "none" | "vertical" | "horizontal" | "both"
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      error = false,
      helperText,
      label,
      required = false,
      maxLength,
      showCount = false,
      resize = "vertical",
      ...props
    },
    ref,
  ) => {
    const [charCount, setCharCount] = React.useState(0)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      props.onChange?.(e)
    }

    const textareaVariants = {
      default: "border-input bg-background hover:border-ring focus:border-ring",
      ghost: "border-transparent bg-muted hover:bg-muted/80 focus:bg-background focus:border-ring",
      outline: "border-2 border-muted-foreground/20 bg-transparent hover:border-muted-foreground/40 focus:border-ring",
    }

    const textareaSizes = {
      sm: "min-h-[60px] px-2 py-1.5 text-sm",
      md: "min-h-[80px] px-3 py-2 text-sm",
      lg: "min-h-[100px] px-4 py-3 text-base",
    }

    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    }

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              textareaVariants[variant],
              textareaSizes[size],
              resizeClasses[resize],
              error && "border-destructive focus:border-destructive focus-visible:ring-destructive",
              className,
            )}
            ref={ref}
            maxLength={maxLength}
            onChange={handleChange}
            {...props}
          />

          {showCount && maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-1 rounded">
              {charCount}/{maxLength}
            </div>
          )}
        </div>

        {(helperText || (showCount && maxLength)) && (
          <div className="flex justify-between items-center">
            {helperText && (
              <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>{helperText}</p>
            )}
            {showCount && maxLength && !helperText && (
              <p className="text-xs text-muted-foreground ml-auto">
                {charCount}/{maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    )
  },
)

Textarea.displayName = "Textarea"

export { Textarea }
