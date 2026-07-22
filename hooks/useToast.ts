import { useContext } from 'react';
import { ToastContext } from '../providers/ToastProvider';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: () => {},
      showSuccess: () => {},
      showError: () => {},
      showInfo: () => {},
      showWarning: () => {},
    };
  }
  return context;
};
