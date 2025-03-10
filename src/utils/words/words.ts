import { getRandomNumber } from '@/utils/utils';
import {
  Definition,
  DefinitionGroup,
  DefinitionTuple,
  DefinitionValue,
  getDefinitionParam,
} from '@/utils/words/definitions';

export type Word = { value: string; definitions: Definition };
export type WordsByCategory = Record<
  (typeof DefinitionValue.CATEGORY)[keyof typeof DefinitionValue.CATEGORY],
  Word[]
>;

export function findWord(
  words: Word[],
  definitions: DefinitionTuple<any>[],
): Word {
  const filteredWords = words.filter((word) => {
    return definitions.every(([group, value]) => {
      return word.definitions[group as DefinitionGroup] == value;
    });
  });

  return filteredWords[getRandomNumber(filteredWords.length)] as Word;
}

export function getVariant1(words: Word[]) {
  const adjective = findWord(words, [
    getDefinitionParam('k', DefinitionValue.CATEGORY.ADJECTIVE),
    getDefinitionParam('c', DefinitionValue.CASE.NOMINATIVE),
  ]);

  const noun = findWord(words, [
    getDefinitionParam('k', DefinitionValue.CATEGORY.NOUN),
    getDefinitionParam('g', adjective?.definitions.g),
    getDefinitionParam('n', adjective?.definitions.n),
    getDefinitionParam('c', adjective?.definitions.c),
  ]);

  const booleanRandom = Math.random() > 0.5;

  const verb = booleanRandom
    ? findWord(words, [
        getDefinitionParam('k', DefinitionValue.CATEGORY.VERB),
        getDefinitionParam('g', noun.definitions.g),
        getDefinitionParam('n', noun.definitions.n),
      ])
    : findWord(words, [
        getDefinitionParam('k', DefinitionValue.CATEGORY.VERB),
        getDefinitionParam('p', DefinitionValue.PERSON.THIRD_PERSON),
        getDefinitionParam('n', noun.definitions.n),
      ]);

  const noun2 = findWord(words, [
    getDefinitionParam('k', DefinitionValue.CATEGORY.NOUN),
    getDefinitionParam('c', DefinitionValue.CASE.ACCUSATIVE),
  ]);

  return [adjective, noun, verb, noun2];
}

export function getVariant1Cached(wordsByCategory: WordsByCategory) {
  const adjective = findWord(
    wordsByCategory[DefinitionValue.CATEGORY.ADJECTIVE],
    [getDefinitionParam('c', DefinitionValue.CASE.NOMINATIVE)],
  );

  const noun = findWord(wordsByCategory[DefinitionValue.CATEGORY.NOUN], [
    getDefinitionParam('g', adjective?.definitions.g),
    getDefinitionParam('n', adjective?.definitions.n),
    getDefinitionParam('c', adjective?.definitions.c),
  ]);

  const booleanRandom = Math.random() > 0.5;

  const verb = booleanRandom
    ? findWord(wordsByCategory[DefinitionValue.CATEGORY.VERB], [
        getDefinitionParam('g', noun.definitions.g),
        getDefinitionParam('n', noun.definitions.n),
      ])
    : findWord(wordsByCategory[DefinitionValue.CATEGORY.VERB], [
        getDefinitionParam('p', DefinitionValue.PERSON.THIRD_PERSON),
        getDefinitionParam('n', noun.definitions.n),
      ]);

  const noun2 = findWord(wordsByCategory[DefinitionValue.CATEGORY.NOUN], [
    getDefinitionParam('k', DefinitionValue.CATEGORY.NOUN),
    getDefinitionParam('c', DefinitionValue.CASE.ACCUSATIVE),
  ]);

  const adjective2 = findWord(
    wordsByCategory[DefinitionValue.CATEGORY.ADJECTIVE],
    [
      getDefinitionParam('c', DefinitionValue.CASE.ACCUSATIVE),
      getDefinitionParam('g', noun2.definitions.g),
      getDefinitionParam('n', noun2.definitions.n),
    ],
  );

  return [adjective, noun, verb, adjective2, noun2];
}
