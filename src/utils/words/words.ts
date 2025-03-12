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
) {
  const adjective = findWord(adjectivesByCase[DefinitionValue.CASE.NOMINATIVE]);

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

  const noun2 = findWord(wordsByCategory[DefinitionValue.CATEGORY.NOUN], [
    getDefinitionParam('c', DefinitionValue.CASE.ACCUSATIVE),
  ]);

  const adjective2 = findWord(
    adjectivesByCase[DefinitionValue.CASE.ACCUSATIVE],
    [
      getDefinitionParam('c', DefinitionValue.CASE.ACCUSATIVE),
      getDefinitionParam('g', noun2.definitions.g),
      getDefinitionParam('n', noun2.definitions.n),
    ],
  );

  return [adjective, noun, verb, adjective2, noun2];
}
