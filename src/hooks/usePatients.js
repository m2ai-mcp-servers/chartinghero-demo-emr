import { useCallback } from 'react';
import { usePolling } from './usePolling';
import { fetchPatients, fetchPatient, fetchTodaysSchedule } from '../services/dataService';

/**
 * Hook to fetch all patients with polling
 */
export function usePatients() {
  const fetchFn = useCallback(() => fetchPatients(), []);
  return usePolling(fetchFn);
}

/**
 * Hook to fetch a single patient with polling
 */
export function usePatient(patientId) {
  const fetchFn = useCallback(() => fetchPatient(patientId), [patientId]);
  return usePolling(fetchFn);
}

/**
 * Hook to fetch today's schedule with polling
 */
export function useTodaysSchedule() {
  const fetchFn = useCallback(() => fetchTodaysSchedule(), []);
  return usePolling(fetchFn);
}

export default usePatients;
