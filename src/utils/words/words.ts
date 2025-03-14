import { getRandomBoolean, getRandomNumber } from '@/utils/utils';
import {
  Definitions,
  DefinitionGroup,
  DefinitionTuple,
  DefinitionValue,
  getDefinitionParam,
} from '@/utils/words/definitions';

export type Word = { value: string; definitions: Definitions };

type PresetName = keyof typeof presets;

const presets = {
  short: () => {
    const variant = getRandomBoolean() ? 'variant1' : 'variant2';
    if (variant === 'variant1') {
      return [
        (words: Word[]) => {
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

          const verb = getRandomBoolean()
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

          return [adjective, noun, verb];
        },
        (words: Word[]) => {
          const noun = findWord(words, [
            getDefinitionParam('k', DefinitionValue.CATEGORY.NOUN),
            getDefinitionParam('c', DefinitionValue.CASE.ACCUSATIVE),
          ]);

          return [noun];
        },
      ];
    }

    return [
      (words: Word[]) => {
        const noun = findWord(words, [
          getDefinitionParam('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionParam('c', DefinitionValue.CASE.NOMINATIVE),
        ]);

        const verb = getRandomBoolean()
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

        return [noun, verb];
      },
      (words: Word[]) => {
        const adjective = findWord(words, [
          getDefinitionParam('k', DefinitionValue.CATEGORY.ADJECTIVE),
          getDefinitionParam('c', DefinitionValue.CASE.ACCUSATIVE),
        ]);

        const noun = findWord(words, [
          getDefinitionParam('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionParam('c', adjective.definitions.c),
          getDefinitionParam('g', adjective.definitions.g),
          getDefinitionParam('n', adjective.definitions.n),
        ]);

        return [adjective, noun];
      },
    ];
  },
  longest: () => [
    (words: Word[]) => {
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

      const verb = getRandomBoolean()
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

      return [adjective, noun, verb];
    },
    (words: Word[]) => {
      const adjective = findWord(words, [
        getDefinitionParam('k', DefinitionValue.CATEGORY.ADJECTIVE),
        getDefinitionParam('c', DefinitionValue.CASE.ACCUSATIVE),
      ]);

      const noun = findWord(words, [
        getDefinitionParam('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionParam('c', adjective.definitions.c),
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
  const word = words[getRandomNumber(0, words.length - 1)] as Word;
  if (definitions) {
    const isValid = definitions.every(([group, value]) => {
      return word.definitions[group as DefinitionGroup] == value;
    });
    return isValid ? word : findWord(words, definitions);
  }

  return word;
}

export function generatePhrase(words: Word[], presetName: PresetName) {
  const preset = presets[presetName];
  return preset()
    .map((fn) => fn(words))
    .flat();
}
