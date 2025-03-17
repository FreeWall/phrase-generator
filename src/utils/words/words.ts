import { getRandomBoolean, getRandomNumber } from '@/utils/utils';
import {
  DefinitionGroup,
  DefinitionTuple,
  DefinitionValue,
  Definitions,
  getDefinitionTuple,
} from '@/utils/words/definitions';

export type Word = {
  name: string;
  value: string;
  definitions: Definitions;
  def: string;
};

type PresetName = keyof typeof presets;
export type Phrase = {
  words: Word[];
  generate: (words: Word[]) => Word[];
}[];

// k12
// c1, c4

const presets = {
  short: () => {
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
  longest: () => [
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

export function generatePhrase(words: Word[], presetName: PresetName): Phrase {
  const preset = presets[presetName];
  return preset().map((generate) => ({ words: generate(words), generate }));
}

export function phraseToString(phrase: Phrase): string {
  return phrase
    .map(({ words }) => words.map((word) => word.value).join(' '))
    .join(' ');
}
