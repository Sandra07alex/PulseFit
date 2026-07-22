import { useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { StorageKey } from '../constants/StorageKeys';

export function useStorage<T>(key: StorageKey, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    StorageService.getItem<T>(key).then((val) => {
      if (isMounted) {
        if (val !== null) setStoredValue(val);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [key]);

  const setValue = async (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    await StorageService.setItem<T>(key, valueToStore);
  };

  return [storedValue, setValue, loading] as const;
}
