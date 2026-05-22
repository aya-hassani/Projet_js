import { useState, useEffect } from 'react';

export const useDraft = (projectId, initialValue = "") => {
  const key = `draft_${projectId}`;
  const [value, setValue] = useState(() => localStorage.getItem(key) || initialValue);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  const clearDraft = () => localStorage.removeItem(key);

  return [value, setValue, clearDraft];
};