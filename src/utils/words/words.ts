import { sum } from 'lodash-es';

import { getRandomNumber } from '@/utils/random';
import { DefinitionGroup, DefinitionTuple, Definitions } from '@/utils/words/definitions';
import { calculateEntropy } from '@/utils/words/entropy';
import { PresetLength, PresetWordDefinition, presets } from '@/utils/words/presets';

export type Word = {
  value: string;
  definitions: Definitions;
};

export type Phrase = {
  word: Word;
  generate: (words: Word[]) => Word;
}[];

function isWordValidByDefinition(word: Word, definitions: DefinitionTuple<any>[]): boolean {
  return definitions.every(([group, value]) => {
    return word.definitions[group as DefinitionGroup] == value;
  });
}

export function findWord(words: Word[], definitions?: DefinitionTuple<any>[]): Word {
  const word = words[getRandomNumber(0, words.length - 1)] as Word;
  if (definitions) {
    const isValid = isWordValidByDefinition(word, definitions);
    return isValid ? word : findWord(words, definitions);
  }

  return word;
}

function filterWords(words: Word[], definitions: DefinitionTuple<any>[]): Word[] {
  return words.filter((word) => {
    return isWordValidByDefinition(word, definitions);
  });
}

export function generatePhrase(words: Word[], phraseLength: PresetLength): Phrase {
  const preset = presets[phraseLength];
  return preset(words).map((wordFunction) => ({
    word: (() => {
      try {
        return wordFunction.word(words);
      } catch (e) {
        // in case of maximum call stack exceeded (rare)
        return wordFunction.word(words);
      }
    })(),
    generate: (words: Word[]) => wordFunction.word(words),
  }));
}

export function getEntropy(words: Word[], phraseLength: PresetLength): number {
  const preset = presets[phraseLength];
  return sum(preset(words).map((wordFunction) => wordFunction.entropy(words)));
}

export function phraseToString(phrase: Phrase): string {
  return phrase.map(({ word }) => word.value).join(' ');
}

export function getWordFunctions(presetWordDefinition: PresetWordDefinition): {
  word: (words: Word[]) => Word;
  entropy: (words: Word[]) => number;
} {
  return {
    word(words: Word[]) {
      const randomDefinition =
        presetWordDefinition.length > 1
          ? presetWordDefinition[getRandomNumber(0, presetWordDefinition.length - 1)]
          : presetWordDefinition[0];
      return findWord(words, [...randomDefinition!.base, ...randomDefinition!.rest]);
    },
    entropy(words: Word[]) {
      const sumWords = presetWordDefinition.reduce((acc, definition) => {
        return acc + filterWords(words, definition.base).length;
      }, 0);
      return calculateEntropy(sumWords);
    },
  };
}

export const minPresetLength = Math.min(...(Object.keys(presets) as unknown as number[]));
export const maxPresetLength = Math.max(...(Object.keys(presets) as unknown as number[]));
