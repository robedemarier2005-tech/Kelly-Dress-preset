'use client';

import { useEffect } from 'react';

export default function CopyProtection() {
  useEffect(() => {
    const blockCopy = (e) => {
      e.preventDefault();
      return false;
    };

    const blockKeyShortcuts = (e) => {
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A')
      ) {
        e.preventDefault();
        return false;
      }
    };

    const blockContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('copy', blockCopy);
    document.addEventListener('cut', blockCopy);
    document.addEventListener('selectstart', blockCopy);
    document.addEventListener('keydown', blockKeyShortcuts);
    document.addEventListener('contextmenu', blockContextMenu);

    return () => {
      document.removeEventListener('copy', blockCopy);
      document.removeEventListener('cut', blockCopy);
      document.removeEventListener('selectstart', blockCopy);
      document.removeEventListener('keydown', blockKeyShortcuts);
      document.removeEventListener('contextmenu', blockContextMenu);
    };
  }, []);

  return null;
}
