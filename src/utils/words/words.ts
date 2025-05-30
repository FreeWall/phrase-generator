import { round } from 'lodash-es';

import { getRandomNumber } from '@/utils/random';
import { DefinitionGroup, DefinitionTuple, Definitions } from '@/utils/words/definitions';
import { calculateEntropy } from '@/utils/words/entropy';
import { PresetLength, presets } from '@/utils/words/presets/cs';

export const wordLists = [
  '/assets/words/cs/k1.txt',
  '/assets/words/cs/k2.txt',
  '/assets/words/cs/k5.txt',
];

export type PresetWordDefinitions = {
  base: DefinitionTuple<any>[];
  rest: DefinitionTuple<any>[];
}[];

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
  const variants = preset(words);
  const randonVariant =
    variants.length > 1 ? variants[getRandomNumber(0, variants.length - 1)] : variants[0];
  return randonVariant!.map((wordFunction) => ({
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
  const variants = preset(words);

  const sumWordsByIndex: number[] = [];
  for (let i = 0; i < phraseLength; i++) {
    const differentWords = new Map(
      variants.map((variant) => [JSON.stringify(variant[i]!.word(words).definitions), variant[i]!]),
    );
    differentWords.forEach(({ sumWords }) => {
      sumWordsByIndex[i] ??= 0;
      sumWordsByIndex[i]! += sumWords(words);
    });
  }

  const entropy = sumWordsByIndex.reduce((acc, value) => {
    return acc + calculateEntropy(value);
  }, 0);

  return round(entropy, 2);
}

export function phraseToString(phrase: Phrase): string {
  return phrase.map(({ word }) => word.value).join(' ');
}

export function getWordFunctions(presetWordDefinitions: PresetWordDefinitions): {
  word: (words: Word[]) => Word;
  sumWords: (words: Word[]) => number;
} {
  return {
    word(words: Word[]) {
      const randomDefinition =
        presetWordDefinitions.length > 1
          ? presetWordDefinitions[getRandomNumber(0, presetWordDefinitions.length - 1)]
          : presetWordDefinitions[0];
      return findWord(words, [...randomDefinition!.base, ...randomDefinition!.rest]);
    },
    sumWords(words: Word[]) {
      const sumWords = presetWordDefinitions.reduce((acc, definition) => {
        return acc + new Set(filterWords(words, definition.base).map((word) => word.value)).size;
      }, 0);
      return sumWords;
    },
  };
}
