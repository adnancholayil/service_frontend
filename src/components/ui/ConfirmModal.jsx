import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false,
}) {
  const isDanger = type === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        {isDanger ? (
          <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mb-2">
            <AlertTriangle className="h-8 w-8 text-rose-500" />
          </div>
        ) : (
          <div className="h-16 w-16 bg-brand/10 rounded-full flex items-center justify-center mb-2">
            <AlertTriangle className="h-8 w-8 text-brand" />
          </div>
        )}
        <p className="text-sm text-muted-foreground">{message}</p>
        
        <div className="flex w-full gap-3 pt-4 mt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            variant={isDanger ? 'danger' : 'primary'} 
            className="flex-1" 
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
