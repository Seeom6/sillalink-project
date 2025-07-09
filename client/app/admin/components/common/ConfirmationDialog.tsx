"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "@/app/shared/ui/button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "text-red-500",
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
          border: "border-red-200",
        };
      case "warning":
        return {
          icon: "text-yellow-500",
          confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
          border: "border-yellow-200",
        };
      case "info":
        return {
          icon: "text-blue-500",
          confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
          border: "border-blue-200",
        };
      default:
        return {
          icon: "text-red-500",
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
          border: "border-red-200",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border-2 ${styles.border}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 ${styles.confirmButton}`}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
