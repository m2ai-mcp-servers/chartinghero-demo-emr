import { VITAL_RANGES } from './constants';

/**
 * Format a date string to display format
 * Handles YYYY-MM-DD format correctly regardless of timezone
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '--';

  // Handle YYYY-MM-DD format by parsing as local time (not UTC)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  }

  const date = new Date(dateString);
  const defaultOptions = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  };

  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Format date as relative time (e.g., "2 days ago")
 */
export function formatRelativeDate(dateString) {
  if (!dateString) return '--';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dob) {
  if (!dob) return null;

  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Format time (HH:MM)
 */
export function formatTime(timeString) {
  if (!timeString) return '--:--';
  return timeString;
}

/**
 * Format blood pressure
 */
export function formatBloodPressure(systolic, diastolic) {
  if (!systolic && !diastolic) return '--/--';
  return `${systolic || '--'}/${diastolic || '--'}`;
}

/**
 * Get vital sign status (normal, warning, danger)
 */
export function getVitalStatus(type, value) {
  if (value === null || value === undefined) return 'empty';

  const range = VITAL_RANGES[type];
  if (!range) return 'normal';

  if (value <= range.critical_low || value >= range.critical_high) return 'danger';
  if (value < range.low || value > range.high) return 'warning';
  return 'normal';
}

/**
 * Get status color class for vital signs
 */
export function getVitalColorClass(status) {
  switch (status) {
    case 'danger':
      return 'text-danger';
    case 'warning':
      return 'text-warning';
    case 'normal':
      return 'text-success';
    default:
      return 'text-gray-400';
  }
}

/**
 * Format patient name
 */
export function formatPatientName(patient, format = 'full') {
  if (!patient) return '';

  switch (format) {
    case 'full':
      return `${patient.firstName} ${patient.lastName}`;
    case 'last_first':
      return `${patient.lastName}, ${patient.firstName}`;
    case 'initials':
      return `${patient.firstName[0]}. ${patient.lastName}`;
    default:
      return `${patient.firstName} ${patient.lastName}`;
  }
}

/**
 * Format address
 */
export function formatAddress(address, truncate = false) {
  if (!address) return '';

  const full = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;

  if (truncate && full.length > 35) {
    return full.substring(0, 32) + '...';
  }

  return full;
}

/**
 * Format seconds ago for live indicator
 */
export function formatSecondsAgo(timestamp) {
  if (!timestamp) return '--';

  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

/**
 * Format visit status for display
 */
export function formatVisitStatus(status) {
  const statusMap = {
    pending: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed',
  };

  return statusMap[status] || status;
}
