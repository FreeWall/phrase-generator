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

export type PresetLength = keyof typeof presets;
export type Phrase = {
  word: Word;
  generate: (words: Word[]) => Word;
}[];

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
  return preset(words).map((generate) => ({
    word: (() => {
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
  return phrase.map(({ word }) => word.value).join(' ');
}

const presets = {
  2: (words: Word[]) => {
    const definitions1 = findWord(words, [
      getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
      getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
    ]).definitions;

    const adjective = (words: Word[]) => {
      return findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
        getDefinitionTuple('g', definitions1.g),
        getDefinitionTuple('n', definitions1.n),
        getDefinitionTuple('c', definitions1.c),
      ]);
    };

    const noun = (words: Word[]) => {
      return findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', definitions1.c),
        getDefinitionTuple('g', definitions1.g),
        getDefinitionTuple('n', definitions1.n),
      ]);
    };

    return [adjective, noun];
  },
  3: (words: Word[]) => {
    const variant = getRandomNumber(1, 2);

    if (variant === 1) {
      const definitions1 = findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
      ]).definitions;

      const adjective = (words: Word[]) => {
        return findWord(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
          getDefinitionTuple('g', definitions1.g),
          getDefinitionTuple('n', definitions1.n),
          getDefinitionTuple('c', definitions1.c),
        ]);
      };

      const noun = (words: Word[]) => {
        return findWord(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionTuple('c', definitions1.c),
          getDefinitionTuple('g', definitions1.g),
          getDefinitionTuple('n', definitions1.n),
        ]);
      };

      const verb = (words: Word[]) => {
        return getRandomBoolean()
          ? findWord(words, [
              getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
              getDefinitionTuple('g', definitions1.g),
              getDefinitionTuple('n', definitions1.n),
            ])
          : findWord(words, [
              getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
              getDefinitionTuple('p', DefinitionValue.PERSON.THIRD_PERSON),
              getDefinitionTuple('n', definitions1.n),
            ]);
      };

      return [adjective, noun, verb];
    }

    if (variant === 2) {
      const verb = (words: Word[]) => {
        return findWord(words, [getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB)]);
      };

      const definitions2 = findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', DefinitionValue.CASE.ACCUSATIVE),
      ]).definitions;

      const adjective = (words: Word[]) => {
        return findWord(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
          getDefinitionTuple('g', definitions2.g),
          getDefinitionTuple('n', definitions2.n),
          getDefinitionTuple('c', definitions2.c),
        ]);
      };

      const noun = (words: Word[]) => {
        return findWord(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionTuple('c', definitions2.c),
          getDefinitionTuple('g', definitions2.g),
          getDefinitionTuple('n', definitions2.n),
        ]);
      };

      return [verb, adjective, noun];
    }

    throw new Error('Invalid variant');
  },
  4: (words: Word[]) => {
    const variant = getRandomNumber(1, 2);

    if (variant === 1) {
      const definitions1 = findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
      ]).definitions;

      const adjective = (words: Word[]) => {
        return findWord(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
          getDefinitionTuple('g', definitions1.g),
          getDefinitionTuple('n', definitions1.n),
          getDefinitionTuple('c', definitions1.c),
        ]);
      };

      const noun = (words: Word[]) => {
        return findWord(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionTuple('c', definitions1.c),
          getDefinitionTuple('g', definitions1.g),
          getDefinitionTuple('n', definitions1.n),
        ]);
      };

      const verb = (words: Word[]) => {
        return getRandomBoolean()
          ? findWord(words, [
              getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
              getDefinitionTuple('g', definitions1.g),
              getDefinitionTuple('n', definitions1.n),
            ])
          : findWord(words, [
              getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
              getDefinitionTuple('p', DefinitionValue.PERSON.THIRD_PERSON),
              getDefinitionTuple('n', definitions1.n),
            ]);
      };

      const noun2 = (words: Word[]) => {
        return findWord(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionTuple('c', DefinitionValue.CASE.ACCUSATIVE),
        ]);
      };

      return [adjective, noun, verb, noun2];
    }

    if (variant === 2) {
      const definitions1 = findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
      ]).definitions;

      const noun = (words: Word[]) => {
        return findWord(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionTuple('c', definitions1.c),
          getDefinitionTuple('g', definitions1.g),
          getDefinitionTuple('n', definitions1.n),
        ]);
      };

      const verb = (words: Word[]) => {
        return getRandomBoolean()
          ? findWord(words, [
              getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
              getDefinitionTuple('g', definitions1.g),
              getDefinitionTuple('n', definitions1.n),
            ])
          : findWord(words, [
              getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
              getDefinitionTuple('p', DefinitionValue.PERSON.THIRD_PERSON),
              getDefinitionTuple('n', definitions1.n),
            ]);
      };

      const definitions2 = findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', DefinitionValue.CASE.ACCUSATIVE),
      ]).definitions;

      const adjective2 = (words: Word[]) => {
        return findWord(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
          getDefinitionTuple('g', definitions2.g),
          getDefinitionTuple('n', definitions2.n),
          getDefinitionTuple('c', definitions2.c),
        ]);
      };

      const noun2 = (words: Word[]) => {
        return findWord(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionTuple('c', definitions2.c),
          getDefinitionTuple('g', definitions2.g),
          getDefinitionTuple('n', definitions2.n),
        ]);
      };

      return [noun, verb, adjective2, noun2];
    }

    throw new Error('Invalid variant');
  },
  5: (words: Word[]) => {
    const definitions1 = findWord(words, [
      getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
      getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
    ]).definitions;

    const adjective = (words: Word[]) => {
      return findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
        getDefinitionTuple('g', definitions1.g),
        getDefinitionTuple('n', definitions1.n),
        getDefinitionTuple('c', definitions1.c),
      ]);
    };

    const noun = (words: Word[]) => {
      return findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', definitions1.c),
        getDefinitionTuple('g', definitions1.g),
        getDefinitionTuple('n', definitions1.n),
      ]);
    };

    const verb = (words: Word[]) => {
      return getRandomBoolean()
        ? findWord(words, [
            getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
            getDefinitionTuple('g', definitions1.g),
            getDefinitionTuple('n', definitions1.n),
          ])
        : findWord(words, [
            getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
            getDefinitionTuple('p', DefinitionValue.PERSON.THIRD_PERSON),
            getDefinitionTuple('n', definitions1.n),
          ]);
    };

    const definitions2 = findWord(words, [
      getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
      getDefinitionTuple('c', DefinitionValue.CASE.ACCUSATIVE),
    ]).definitions;

    const adjective2 = (words: Word[]) => {
      return findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
        getDefinitionTuple('g', definitions2.g),
        getDefinitionTuple('n', definitions2.n),
        getDefinitionTuple('c', definitions2.c),
      ]);
    };

    const noun2 = (words: Word[]) => {
      return findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', definitions2.c),
        getDefinitionTuple('g', definitions2.g),
        getDefinitionTuple('n', definitions2.n),
      ]);
    };

    return [adjective, noun, verb, adjective2, noun2];
  },
};
