import { useEffect } from 'react';
import { combine } from 'zustand/middleware';
import { createWithEqualityFn as create } from 'zustand/traditional';

import { PasswordizeOptions } from '@/utils/words/passwordize';
import { PresetLength } from '@/utils/words/presets/cs';
import { Setter, createSetter } from '@/utils/zustand';

const storageKey = 'phrase-generator';

export interface StorageData {
  phraseOptions: {
    entropyExpanded?: boolean;
    phraseLength?: PresetLength;
    maxWordLength?: number;
  };
  passwordizeOptions: PasswordizeOptions;
}

interface StorageStore extends StorageData {
  setPhraseOptions: Setter<StorageStore['phraseOptions']>;
  setPasswordizeOptions: Setter<StorageStore['passwordizeOptions']>;
  reset: () => void;
}

const defaults: StorageData = {
  phraseOptions: {},
  passwordizeOptions: {},
};

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
    setPhraseOptions: createSetter(set, get, 'phraseOptions'),
    setPasswordizeOptions: createSetter(set, get, 'passwordizeOptions'),
    reset: () => set(defaults),
  })),
);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const phraseOptions = useStorageStore((state) => state.phraseOptions);
  const passwordizeOptions = useStorageStore((state) => state.passwordizeOptions);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        phraseOptions,
        passwordizeOptions,
      }),
    );
  }, [phraseOptions, passwordizeOptions]);

  return children;
}
