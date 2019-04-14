import { useEffect } from 'react';

export default function useKeyDown(
  arrayOfKey,
  callback,
) {
  useEffect(() => {
    const excute = event => {
      if (arrayOfKey.includes(event.key)) {
        callback(event);
      }
    };
    document.addEventListener('keydown', excute);

    return () => document.removeEventListener('keydown', excute);
  });
}
