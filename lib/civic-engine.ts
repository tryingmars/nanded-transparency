import { addMonths, isAfter, parseISO } from 'date-fns';

export interface ProjectStatus {
  isDelayed: boolean;
  statusLabel: '⚠️ DELAYED' | '✅ ON TRACK';
}

/**
 * Calculates if a project is delayed based on sanction date and duration.
 * Current reference date is set to Feb 2026 as per system context.
 * 
 * @param sanctionDateStr ISO date string (YYYY-MM-DD)
 * @param durationMonths Number of months for completion
 * @param completionStatus Completion percentage (0-100)
 */
export function calculateProjectStatus(
  sanctionDateStr: string,
  durationMonths: number,
  completionStatus: number
): ProjectStatus {
  // Fixed reference date: Feb 2026 (2026-02-01)
  const CURRENT_DATE = new Date(2026, 1, 1); // Month is 0-indexed in JS Date
  
  const sanctionDate = parseISO(sanctionDateStr);
  const expectedCompletionDate = addMonths(sanctionDate, durationMonths);
  
  // If current date is after expected completion date AND not 100% complete
  if (isAfter(CURRENT_DATE, expectedCompletionDate) && completionStatus < 100) {
    return {
      isDelayed: true,
      statusLabel: '⚠️ DELAYED'
    };
  }
  
  return {
    isDelayed: false,
    statusLabel: '✅ ON TRACK'
  };
}

/**
 * Formats a number to Indian currency format (Lakhs/Crores)
 */
export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}
