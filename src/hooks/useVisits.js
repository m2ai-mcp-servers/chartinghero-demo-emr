import { useCallback } from 'react';
import { usePolling } from './usePolling';
import { fetchVisits, fetchVisit, fetchPatientVisits, fetchCurrentVisit } from '../services/dataService';

/**
 * Hook to fetch all visits with polling
 */
export function useVisits() {
  const fetchFn = useCallback(() => fetchVisits(), []);
  return usePolling(fetchFn);
}

/**
 * Hook to fetch a single visit with polling
 */
export function useVisit(visitId) {
  const fetchFn = useCallback(() => fetchVisit(visitId), [visitId]);
  return usePolling(fetchFn);
}

/**
 * Hook to fetch visits for a patient with polling
 */
export function usePatientVisits(patientId) {
  const fetchFn = useCallback(() => fetchPatientVisits(patientId), [patientId]);
  return usePolling(fetchFn);
}

/**
 * Hook to fetch the current/most recent visit for a patient
 */
export function useCurrentVisit(patientId) {
  const fetchFn = useCallback(() => fetchCurrentVisit(patientId), [patientId]);
  return usePolling(fetchFn);
}

export default useVisits;
