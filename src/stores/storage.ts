import { combine } from 'zustand/middleware';
import { createWithEqualityFn as create } from 'zustand/traditional';

const storageKey = 'phrase-generator';

export interface StorageData {}

interface StorageStore extends StorageData {
  reset: () => void;
}

function loadFromStorage(): StorageData {
  const stored = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : undefined;

  if (stored) {
    return JSON.parse(stored);
  }

  return {};
}

export const useStorageStore = create(
  combine<StorageData, StorageStore>(loadFromStorage(), (set, get) => ({
    reset: () => set({}),
  })),
);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  /* const dateFormat = useStorageStore((state) => state.dateFormat);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        dateFormat,
      }),
    );
  }, [dateFormat]); */

  return children;
}
