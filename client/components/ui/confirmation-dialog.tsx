'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX, FiTrash2, FiCheck } from 'react-icons/fi';
import { EnhancedButton } from './enhanced-button';
import { GlassCard } from './glass-card';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: FiTrash2,
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/20',
          confirmButton: 'bg-red-500 hover:bg-red-600'
        };
      case 'warning':
        return {
          icon: FiAlertTriangle,
          iconColor: 'text-yellow-400',
          iconBg: 'bg-yellow-500/20',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600'
        };
      case 'info':
        return {
          icon: FiCheck,
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-500/20',
          confirmButton: 'bg-blue-500 hover:bg-blue-600'
        };
      default:
        return {
          icon: FiAlertTriangle,
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/20',
          confirmButton: 'bg-red-500 hover:bg-red-600'
        };
    }
  };

  const styles = getVariantStyles();
  const IconComponent = styles.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard variant="secondary" className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 ${styles.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      {title}
                    </h3>
                  </div>
                  
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3">
                  <EnhancedButton
                    variant="ghost"
                    onClick={onClose}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    {cancelText}
                  </EnhancedButton>
                  
                  <EnhancedButton
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`text-white ${styles.confirmButton} transition-colors`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <IconComponent className="w-4 h-4" />
                        {confirmText}
                      </>
                    )}
                  </EnhancedButton>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;
