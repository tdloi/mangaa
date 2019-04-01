import { useState, useEffect } from 'react';

export default function useLocalStorage(key, defaultValue = null) {
  const [localStorageValue, setLocalStorageValue] = useState(defaultValue);

  useEffect(() => {
    const sync = () => {
      const item = localStorage.getItem(key) || defaultValue;
      setLocalStorageValue(item);
    };
    sync();
    // update value across tabs
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('storage', sync);
    };
  }, [key, defaultValue]);

  const save = value => {
    if (key == null) {
      throw new Error('key must not be null / undefined');
    }
    localStorage.setItem(key, value);
    setLocalStorageValue(value);
  };

  return [localStorageValue, save];
}
