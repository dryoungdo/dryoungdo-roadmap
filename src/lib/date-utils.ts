import { MONTHS_TH } from '../constants';

/**
 * Get day of year (1-366) from a date string
 */
export function getDayOfYear(dateStr: string): number {
  const date = new Date(dateStr);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - startOfYear.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Get number of days in a year (365 or 366 for leap years)
 */
export function getDaysInYear(year: number): number {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
}

/**
 * Calculate CSS position for a Gantt bar within a year
 * Returns left and width as percentages
 */
export function getBarPosition(
  startDate: string,
  endDate: string,
  year: number
): { left: string; width: string } {
  const startDay = getDayOfYear(startDate);
  const endDay = getDayOfYear(endDate);
  const totalDays = getDaysInYear(year);

  const left = ((startDay - 1) / totalDays) * 100;
  const width = ((endDay - startDay + 1) / totalDays) * 100;

  return {
    left: `${left.toFixed(2)}%`,
    width: `${width.toFixed(2)}%`
  };
}

/**
 * Format date as Thai format: "15 ม.ค. 2026"
 */
export function formatDateTh(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = MONTHS_TH[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Format date range as Thai format: "ม.ค. - มี.ค. 2026"
 */
export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startMonth = MONTHS_TH[startDate.getMonth()];
  const endMonth = MONTHS_TH[endDate.getMonth()];
  const year = endDate.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${year}`;
  }

  return `${startMonth} - ${endMonth} ${year}`;
}

/**
 * Check if a date falls within a specific month
 */
export function isInMonth(dateStr: string, month: number): boolean {
  const date = new Date(dateStr);
  return date.getMonth() === month;
}
