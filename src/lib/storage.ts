const STORAGE_PREFIX = 'dryoungdo-roadmap-';

/**
 * Load data from localStorage with fallback
 */
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.error(`Failed to load from storage: ${key}`, error);
  }
  return fallback;
}

/**
 * Save data to localStorage
 */
export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save to storage: ${key}`, error);
  }
}
