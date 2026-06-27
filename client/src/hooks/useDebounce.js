import { useState, useEffect } from 'react';

/**
 * useDebounce
 *
 * Delays updating a value until the user has stopped typing.
 * Use this on search inputs to avoid firing an API call on every keystroke.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchInput, 400);
 *   // Pass debouncedSearch to React Query — it only refetches when the user pauses
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;