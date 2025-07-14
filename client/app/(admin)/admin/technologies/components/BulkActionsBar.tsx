'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrash2, 
  FiEdit, 
  FiX, 
  FiCheck,
  FiDownload,
  FiCopy,
  FiStar,
  FiEyeOff
} from 'react-icons/fi';
import { TechnologyStatus } from '@/lib/types/technology';
import { useDeleteTechnology } from '@/lib/hooks/use-technologies';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { GlassCard } from '@/components/ui/glass-card';

interface BulkActionsBarProps {
  selectedCount: number;
  selectedIds: string[];
  onClearSelection: () => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDestructive = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md"
      >
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-primary-300 mb-6">{message}</p>
          
          <div className="flex items-center justify-end space-x-3">
            <EnhancedButton
              variant="outline"
              onClick={onCancel}
              className="border-primary-500/30"
            >
              {cancelText}
            </EnhancedButton>
            <EnhancedButton
              variant={isDestructive ? "outline" : "primary"}
              onClick={onConfirm}
              className={isDestructive ? "border-red-500/30 text-red-400 hover:border-red-500/50" : ""}
            >
              {confirmText}
            </EnhancedButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  selectedIds,
  onClearSelection
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'delete' | 'status';
    status?: TechnologyStatus;
  }>({ isOpen: false, type: 'delete' });

  const deleteHook = useDeleteTechnology();

  const handleStatusUpdate = (status: TechnologyStatus) => {
    setConfirmationModal({
      isOpen: true,
      type: 'status',
      status
    });
    setShowStatusMenu(false);
  };

  const handleDelete = () => {
    setConfirmationModal({
      isOpen: true,
      type: 'delete'
    });
  };

  const confirmAction = () => {
    if (confirmationModal.type === 'delete') {
      // For now, just clear selection and show message
      console.log('Bulk delete not implemented yet for IDs:', selectedIds);
      onClearSelection();
      setConfirmationModal({ isOpen: false, type: 'delete' });
    } else if (confirmationModal.type === 'status' && confirmationModal.status) {
      // For now, just clear selection and show message
      console.log('Bulk status update not implemented yet:', confirmationModal.status);
      onClearSelection();
      setConfirmationModal({ isOpen: false, type: 'status' });
    }
  };

  const statusOptions = [
    { value: TechnologyStatus.ACTIVE, label: 'Active', icon: FiCheck, color: 'text-green-400' },
    { value: TechnologyStatus.LEARNING, label: 'Learning', icon: FiEdit, color: 'text-blue-400' },
    { value: TechnologyStatus.EXPERT, label: 'Expert', icon: FiStar, color: 'text-purple-400' },
    { value: TechnologyStatus.INACTIVE, label: 'Inactive', icon: FiEyeOff, color: 'text-gray-400' },
    { value: TechnologyStatus.DEPRECATED, label: 'Deprecated', icon: FiX, color: 'text-red-400' }
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <span className="text-primary-400 text-sm font-semibold">{selectedCount}</span>
                </div>
                <span className="text-white font-medium">
                  {selectedCount} {selectedCount === 1 ? 'technology' : 'technologies'} selected
                </span>
              </div>
              
              <button
                onClick={onClearSelection}
                className="text-primary-300 hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {/* Status Update Dropdown */}
              <div className="relative">
                <EnhancedButton
                  variant="outline"
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className="border-primary-500/30 hover:border-primary-500/50"
                  disabled={false}
                >
                  <FiEdit size={16} />
                  Update Status
                </EnhancedButton>

                {showStatusMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-dark-800/95 backdrop-blur-xl border border-primary-500/20 rounded-xl shadow-xl z-10"
                  >
                    <div className="p-2">
                      {statusOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleStatusUpdate(option.value)}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-primary-500/10 rounded-lg transition-colors"
                          >
                            <Icon size={16} className={option.color} />
                            <span className="text-white">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Export */}
              <EnhancedButton
                variant="outline"
                onClick={() => {
                  // Implement export functionality
                  console.log('Export selected technologies:', selectedIds);
                }}
                className="border-primary-500/30 hover:border-primary-500/50"
              >
                <FiDownload size={16} />
                Export
              </EnhancedButton>

              {/* Duplicate */}
              <EnhancedButton
                variant="outline"
                onClick={() => {
                  // Implement duplicate functionality
                  console.log('Duplicate selected technologies:', selectedIds);
                }}
                className="border-primary-500/30 hover:border-primary-500/50"
              >
                <FiCopy size={16} />
                Duplicate
              </EnhancedButton>

              {/* Delete */}
              <EnhancedButton
                variant="outline"
                onClick={handleDelete}
                className="border-red-500/30 text-red-400 hover:border-red-500/50"
                disabled={false}
              >
                <FiTrash2 size={16} />
                Delete
              </EnhancedButton>
            </div>
          </div>

          {/* Loading indicator - removed for now */}
        </GlassCard>
      </motion.div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={
          confirmationModal.type === 'delete' 
            ? 'Delete Technologies' 
            : 'Update Technology Status'
        }
        message={
          confirmationModal.type === 'delete'
            ? `Are you sure you want to delete ${selectedCount} ${selectedCount === 1 ? 'technology' : 'technologies'}? This action cannot be undone.`
            : `Are you sure you want to update the status of ${selectedCount} ${selectedCount === 1 ? 'technology' : 'technologies'} to "${confirmationModal.status}"?`
        }
        confirmText={confirmationModal.type === 'delete' ? 'Delete' : 'Update'}
        cancelText="Cancel"
        onConfirm={confirmAction}
        onCancel={() => setConfirmationModal({ isOpen: false, type: 'delete' })}
        isDestructive={confirmationModal.type === 'delete'}
      />

      {/* Click outside to close status menu */}
      {showStatusMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowStatusMenu(false)}
        />
      )}
    </>
  );
};
