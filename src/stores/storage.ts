import { useEffect } from 'react';
import { combine } from 'zustand/middleware';
import { createWithEqualityFn as create } from 'zustand/traditional';

import { PresetLength } from '@/utils/words/presets/cs';
import { Setter, createSetter } from '@/utils/zustand';

const storageKey = 'phrase-generator';

export interface StorageData {
  entropyExpanded?: boolean;
  phraseLength?: PresetLength;
  maxWordLength?: number;
  digits?: number;
}

interface StorageStore extends StorageData {
  setEntropyExpanded: Setter<StorageStore['entropyExpanded']>;
  setPhraseLength: Setter<StorageStore['phraseLength']>;
  setMaxWordLength: Setter<StorageStore['maxWordLength']>;
  setDigits: Setter<StorageStore['digits']>;
  reset: () => void;
}

const defaults: StorageData = {};

function loadFromStorage(): StorageData {
  const stored = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : undefined;

  return {
    ...defaults,
    ...(stored ? JSON.parse(stored) : {}),
  };
}

export const useStorageStore = create(
  combine<StorageData, StorageStore>(loadFromStorage(), (set, get) => ({
    ...loadFromStorage(),
    setEntropyExpanded: createSetter(set, get, 'entropyExpanded'),
    setPhraseLength: createSetter(set, get, 'phraseLength'),
    setMaxWordLength: createSetter(set, get, 'maxWordLength'),
    setDigits: createSetter(set, get, 'digits'),
    reset: () => set(defaults),
  })),
);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const entropyExpanded = useStorageStore((state) => state.entropyExpanded);
  const phraseLength = useStorageStore((state) => state.phraseLength);
  const maxWordLength = useStorageStore((state) => state.maxWordLength);
  const digits = useStorageStore((state) => state.digits);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        entropyExpanded,
        phraseLength,
        maxWordLength,
        digits,
      }),
    );
  }, [entropyExpanded, phraseLength, maxWordLength, digits]);

  return children;
}
