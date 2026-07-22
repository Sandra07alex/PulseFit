import React, { createContext, useState, useCallback } from 'react';
import { BottomSheet } from '../components/ui/BottomSheet';

export interface BottomSheetConfig {
  title?: string;
  subtitle?: string;
  height?: number;
  content: React.ReactNode;
}

export interface BottomSheetContextValue {
  openBottomSheet: (config: BottomSheetConfig) => void;
  closeBottomSheet: () => void;
}

export const BottomSheetContext = createContext<BottomSheetContextValue | undefined>(undefined);

export const BottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<BottomSheetConfig | null>(null);

  const openBottomSheet = useCallback((newConfig: BottomSheetConfig) => {
    setConfig(newConfig);
  }, []);

  const closeBottomSheet = useCallback(() => {
    setConfig(null);
  }, []);

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}
      {config && (
        <BottomSheet
          visible={Boolean(config)}
          onClose={closeBottomSheet}
          title={config.title}
          subtitle={config.subtitle}
          height={config.height}
        >
          {config.content}
        </BottomSheet>
      )}
    </BottomSheetContext.Provider>
  );
};
