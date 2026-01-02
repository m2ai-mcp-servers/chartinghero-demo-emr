import { useState, useEffect, useCallback, useRef } from 'react';
import { POLL_INTERVAL } from '../utils/constants';
import { detectChanges } from '../services/dataService';

/**
 * Generic polling hook with change detection
 * @param {Function} fetchFn - Async function to fetch data
 * @param {number} interval - Polling interval in ms (default: POLL_INTERVAL)
 * @returns {Object} { data, loading, error, lastUpdate, changedFields }
 */
export function usePolling(fetchFn, interval = POLL_INTERVAL) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [changedFields, setChangedFields] = useState([]);

  const previousDataRef = useRef(null);

  const poll = useCallback(async () => {
    try {
      const result = await fetchFn();

      // Detect changes from previous data
      if (previousDataRef.current) {
        const changes = detectChanges(previousDataRef.current, result);
        if (changes.length > 0) {
          setChangedFields(changes);
          // Clear changed fields after animation duration
          setTimeout(() => setChangedFields([]), 1500);
        }
      }

      previousDataRef.current = result;
      setData(result);
      setLastUpdate(Date.now());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    poll(); // Initial fetch

    const timer = setInterval(poll, interval);
    return () => clearInterval(timer);
  }, [poll, interval]);

  return { data, loading, error, lastUpdate, changedFields };
}

/**
 * Check if a specific field path is in the changed fields list
 */
export function isFieldChanged(changedFields, fieldPath) {
  return changedFields.some(path =>
    path === fieldPath || path.startsWith(`${fieldPath}.`)
  );
}

export default usePolling;
