import { getRandomBoolean, getRandomNumber } from '@/utils/random';
import {
  DefinitionGroup,
  DefinitionTuple,
  DefinitionValue,
  Definitions,
  getDefinitionTuple,
} from '@/utils/words/definitions';

export type Word = {
  value: string;
  definitions: Definitions;
};

type PresetLength = keyof typeof presets;
export type Phrase = {
  words: Word[];
  generate: (words: Word[]) => Word[];
}[];

const presets = {
  4: () => {
    const variant = getRandomBoolean() ? 'variant1' : 'variant2';
    if (variant === 'variant1') {
      return [
        (words: Word[]) => {
          const noun = findWord(words, [
            getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
            getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
          ]);

          const adjective = findWord(words, [
            getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
            getDefinitionTuple('g', noun.definitions.g),
            getDefinitionTuple('n', noun.definitions.n),
            getDefinitionTuple('c', noun.definitions.c),
          ]);

          const verb = getRandomBoolean()
            ? findWord(words, [
                getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
                getDefinitionTuple('g', noun.definitions.g),
                getDefinitionTuple('n', noun.definitions.n),
              ])
            : findWord(words, [
                getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
                getDefinitionTuple('p', DefinitionValue.PERSON.THIRD_PERSON),
                getDefinitionTuple('n', noun.definitions.n),
              ]);

          return [adjective, noun, verb];
        },
        (words: Word[]) => {
          const noun = findWord(words, [
            getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
            getDefinitionTuple('c', DefinitionValue.CASE.ACCUSATIVE),
          ]);

          return [noun];
        },
      ];
    }

    return [
      (words: Word[]) => {
        const noun = findWord(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
        ]);

        const verb = getRandomBoolean()
          ? findWord(words, [
              getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
              getDefinitionTuple('g', noun.definitions.g),
              getDefinitionTuple('n', noun.definitions.n),
            ])
          : findWord(words, [
              getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
              getDefinitionTuple('p', DefinitionValue.PERSON.THIRD_PERSON),
              getDefinitionTuple('n', noun.definitions.n),
            ]);

        return [noun, verb];
      },
      (words: Word[]) => {
        const noun = findWord(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionTuple('c', DefinitionValue.CASE.ACCUSATIVE),
        ]);

        const adjective = findWord(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
          getDefinitionTuple('g', noun.definitions.g),
          getDefinitionTuple('n', noun.definitions.n),
          getDefinitionTuple('c', noun.definitions.c),
        ]);

        return [adjective, noun];
      },
    ];
  },
  5: () => [
    (words: Word[]) => {
      const noun = findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
      ]);

      const adjective = findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
        getDefinitionTuple('g', noun.definitions.g),
        getDefinitionTuple('n', noun.definitions.n),
        getDefinitionTuple('c', noun.definitions.c),
      ]);

      const verb = getRandomBoolean()
        ? findWord(words, [
            getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
            getDefinitionTuple('g', noun.definitions.g),
            getDefinitionTuple('n', noun.definitions.n),
          ])
        : findWord(words, [
            getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
            getDefinitionTuple('p', DefinitionValue.PERSON.THIRD_PERSON),
            getDefinitionTuple('n', noun.definitions.n),
          ]);

      return [adjective, noun, verb];
    },
    (words: Word[]) => {
      const noun = findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', DefinitionValue.CASE.ACCUSATIVE),
      ]);

      const adjective = findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
        getDefinitionTuple('g', noun.definitions.g),
        getDefinitionTuple('n', noun.definitions.n),
        getDefinitionTuple('c', noun.definitions.c),
      ]);

      return [adjective, noun];
    },
  ],
};

export function findWord(words: Word[], definitions?: DefinitionTuple<any>[]): Word {
  const word = words[getRandomNumber(0, words.length - 1)] as Word;
  if (definitions) {
    const isValid = definitions.every(([group, value]) => {
      return word.definitions[group as DefinitionGroup] == value;
    });
    return isValid ? word : findWord(words, definitions);
  }

  return word;
}

export function generatePhrase(words: Word[], phraseLength: PresetLength): Phrase {
  const preset = presets[phraseLength];
  return preset().map((generate) => ({
    words: (() => {
      try {
        return generate(words);
      } catch (e) {
        // in case of maximum call stack exceeded (rare)
        return generate(words);
      }
    })(),
    generate,
  }));
}

export function phraseToString(phrase: Phrase): string {
  return phrase.map(({ words }) => words.map((word) => word.value).join(' ')).join(' ');
}
