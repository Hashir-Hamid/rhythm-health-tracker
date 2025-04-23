
/**
 * A typed wrapper for localStorage to enforce consistent patterns
 * and handle errors gracefully.
 */

export const localStorageService = {
  /**
   * Get data from localStorage
   * @param key The key to retrieve data for
   * @param defaultValue Value to return if key doesn't exist
   */
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error getting ${key} from localStorage:`, e);
      return defaultValue;
    }
  },

  /**
   * Store data in localStorage
   * @param key The key to store data under
   * @param value The data to store
   */
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error setting ${key} in localStorage:`, e);
      return false;
    }
  },

  /**
   * Remove data from localStorage
   * @param key The key to remove
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Error removing ${key} from localStorage:`, e);
      return false;
    }
  },

  /**
   * Clear all app data from localStorage
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Error clearing localStorage:', e);
      return false;
    }
  }
};
