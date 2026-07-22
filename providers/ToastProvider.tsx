import React, { createContext, useState, useCallback } from 'react';
import { Toast } from '../components/ui/Toast';
import { CompanionId } from '../components/mascot/types';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  companionId?: CompanionId;
}

export interface ToastContextValue {
  showToast: (message: string, type?: ToastMessage['type'], companionId?: CompanionId) => void;
  showSuccess: (message: string, companionId?: CompanionId) => void;
  showError: (message: string, companionId?: CompanionId) => void;
  showInfo: (message: string, companionId?: CompanionId) => void;
  showWarning: (message: string, companionId?: CompanionId) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'info', companionId: CompanionId = 'pulse') => {
      setCurrentToast({
        id: String(Date.now()),
        message,
        type,
        companionId,
      });
    },
    []
  );

  const showSuccess = useCallback((message: string, companionId: CompanionId = 'pulse') => {
    showToast(message, 'success', companionId);
  }, [showToast]);

  const showError = useCallback((message: string, companionId: CompanionId = 'pulse') => {
    showToast(message, 'error', companionId);
  }, [showToast]);

  const showInfo = useCallback((message: string, companionId: CompanionId = 'pulse') => {
    showToast(message, 'info', companionId);
  }, [showToast]);

  const showWarning = useCallback((message: string, companionId: CompanionId = 'pulse') => {
    showToast(message, 'warning', companionId);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo, showWarning }}>
      {children}
      {currentToast && (
        <Toast
          visible={Boolean(currentToast)}
          message={currentToast.message}
          type={currentToast.type}
          companionId={currentToast.companionId}
          onDismiss={() => setCurrentToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
};
