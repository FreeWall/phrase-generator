import { getRandomBoolean, getRandomNumber } from '@/utils/utils';
import {
  Definitions,
  DefinitionGroup,
  DefinitionTuple,
  DefinitionValue,
  getDefinitionParam,
} from '@/utils/words/definitions';

export type Word = { value: string; definitions: Definitions };
export type WordsByCategory = Record<
  (typeof DefinitionValue.CATEGORY)[keyof typeof DefinitionValue.CATEGORY],
  Word[]
>;
export type AdjectivesByCase = Record<
  (typeof DefinitionValue.CASE)[keyof typeof DefinitionValue.CASE],
  Word[]
>;

type PresetName = keyof typeof presets;

const presets = {
  shortest: [
    (wordsByCategory: WordsByCategory, adjectivesByCase: AdjectivesByCase) => {
      const adjective = findWord(
        adjectivesByCase[DefinitionValue.CASE.NOMINATIVE],
      );

      const noun = findWord(wordsByCategory[DefinitionValue.CATEGORY.NOUN], [
        getDefinitionParam('g', adjective.definitions.g),
        getDefinitionParam('n', adjective.definitions.n),
        getDefinitionParam('c', adjective.definitions.c),
      ]);

      const verb = getRandomBoolean()
        ? findWord(wordsByCategory[DefinitionValue.CATEGORY.VERB], [
            getDefinitionParam('g', noun.definitions.g),
            getDefinitionParam('n', noun.definitions.n),
          ])
        : findWord(wordsByCategory[DefinitionValue.CATEGORY.VERB], [
            getDefinitionParam('p', DefinitionValue.PERSON.THIRD_PERSON),
            getDefinitionParam('n', noun.definitions.n),
          ]);

      return [adjective, noun, verb];
    },
    (wordsByCategory: WordsByCategory) => {
      const noun = findWord(wordsByCategory[DefinitionValue.CATEGORY.NOUN], [
        getDefinitionParam('c', DefinitionValue.CASE.ACCUSATIVE),
      ]);

      return [noun];
    },
  ],
  longest: [
    (wordsByCategory: WordsByCategory, adjectivesByCase: AdjectivesByCase) => {
      const adjective = findWord(
        adjectivesByCase[DefinitionValue.CASE.NOMINATIVE],
      );

      const noun = findWord(wordsByCategory[DefinitionValue.CATEGORY.NOUN], [
        getDefinitionParam('g', adjective?.definitions.g),
        getDefinitionParam('n', adjective?.definitions.n),
        getDefinitionParam('c', adjective?.definitions.c),
      ]);

      const verb = getRandomBoolean()
        ? findWord(wordsByCategory[DefinitionValue.CATEGORY.VERB], [
            getDefinitionParam('g', noun.definitions.g),
            getDefinitionParam('n', noun.definitions.n),
          ])
        : findWord(wordsByCategory[DefinitionValue.CATEGORY.VERB], [
            getDefinitionParam('p', DefinitionValue.PERSON.THIRD_PERSON),
            getDefinitionParam('n', noun.definitions.n),
          ]);

      return [adjective, noun, verb];
    },
    (wordsByCategory: WordsByCategory, adjectivesByCase: AdjectivesByCase) => {
      const adjective = findWord(
        adjectivesByCase[DefinitionValue.CASE.ACCUSATIVE],
      );

      const noun = findWord(wordsByCategory[DefinitionValue.CATEGORY.NOUN], [
        getDefinitionParam('c', DefinitionValue.CASE.ACCUSATIVE),
        getDefinitionParam('g', adjective.definitions.g),
        getDefinitionParam('n', adjective.definitions.n),
      ]);

      return [adjective, noun];
    },
  ],
};

export function findWord(
  words: Word[],
  definitions?: DefinitionTuple<any>[],
): Word {
  const filteredWords = definitions
    ? words.filter((word) => {
        return definitions.every(([group, value]) => {
          return word.definitions[group as DefinitionGroup] == value;
        });
      })
    : words;

  return filteredWords[getRandomNumber(0, filteredWords.length - 1)] as Word;
}

export function generatePhrase(
  wordsByCategory: WordsByCategory,
  adjectivesByCase: AdjectivesByCase,
  presetName: PresetName,
) {
  const preset = presets[presetName];
  return preset.map((fn) => fn(wordsByCategory, adjectivesByCase)).flat();
}
