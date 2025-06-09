import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type ScheduleStore = {
  organizationId: string;
  deliveryTypeId: string;
  dateTime: Date;
  lastUpdated: number; // timestamp for data freshness
}

const STORAGE_KEY = "schedule_store";
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Validate schedule data
const isValidSchedule = (data: any): data is ScheduleStore => {
  if (!data) return false;
  if (typeof data.organizationId !== 'string') return false;
  if (typeof data.deliveryTypeId !== 'string') return false;
  if (!(data.dateTime instanceof Date)) return false;
  if (typeof data.lastUpdated !== 'number') return false;
  return true;
};

// Check if data is stale
const isStale = (data: ScheduleStore | null): boolean => {
  if (!data) return true;
  const now = Date.now();
  return now - data.lastUpdated > MAX_AGE_MS;
};

export const scheduleStore = atomWithStorage<ScheduleStore | null>(
  STORAGE_KEY,
  null,
  {
    getItem: (key) => {
      try {
        const value = localStorage.getItem(key);
        if (!value) return null;

        const parsed = JSON.parse(value);
        // Convert string date back to Date object
        if (parsed?.dateTime) {
          parsed.dateTime = new Date(parsed.dateTime);
        }

        // Validate data structure
        if (!isValidSchedule(parsed)) {
          console.warn('Invalid schedule data found in storage');
          localStorage.removeItem(key);
          return null;
        }

        // Check if data is stale
        if (isStale(parsed)) {
          console.warn('Stale schedule data found in storage');
          localStorage.removeItem(key);
          return null;
        }

        return parsed;
      } catch (error) {
        console.error('Error reading schedule from storage:', error);
        localStorage.removeItem(key);
        return null;
      }
    },
    setItem: (key, value) => {
      try {
        if (value) {
          // Add timestamp when saving
          const dataToStore = {
            ...value,
            lastUpdated: Date.now()
          };
          localStorage.setItem(key, JSON.stringify(dataToStore));
        } else {
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.error('Error saving schedule to storage:', error);
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing schedule from storage:', error);
      }
    },
  }
);

// Listen for storage changes across tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      // Force a re-render when storage changes in another tab
      window.location.reload();
    }
  });
}

export const useScheduleStore = () => {
  const [schedule, setSchedule] = useAtom(scheduleStore);

  const updateSchedule = (newSchedule: ScheduleStore | null) => {
    if (newSchedule) {
      setSchedule({
        ...newSchedule,
        lastUpdated: Date.now()
      });
    } else {
      setSchedule(null);
    }
  };

  const clearSchedule = () => {
    setSchedule(null);
  };

  return {
    schedule,
    setSchedule: updateSchedule,
    clearSchedule,
    isStale: schedule ? isStale(schedule) : true
  };
};