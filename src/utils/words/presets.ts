import { DefinitionTuple, DefinitionValue, getDefinitionTuple } from '@/utils/words/definitions';
import { Word, findWord, getWordFunctions } from '@/utils/words/words';

export type PresetLength = keyof typeof presets;

export type PresetWordDefinition = {
  base: DefinitionTuple<any>[];
  rest: DefinitionTuple<any>[];
}[];

export const presets = {
  /* 2: ((words: Word[]) => {
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
        getDefinitionTuple('g', definitions1.g),
        getDefinitionTuple('n', definitions1.n),
        getDefinitionTuple('c', definitions1.c),
      ]);
    };

    const _adjective: PresetWordDefinition = {
      base: [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
        getDefinitionTuple('c', definitions1.c),
      ],
      rest: [getDefinitionTuple('g', definitions1.g), getDefinitionTuple('n', definitions1.n)],
    };

    const _noun: PresetWordDefinition = {
      base: [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', definitions1.c),
      ],
      rest: [getDefinitionTuple('g', definitions1.g), getDefinitionTuple('n', definitions1.n)],
    };

    if (entropy) {
      return calculateEntropy(
        filterWords(words, _adjective.base).length * filterWords(words, _noun.base).length,
      );
    }

    return [getWordFunctions(_adjective), getWordFunctions(_noun)];
  }) as PresetFunction,
  3: ((words: Word[], entropy: boolean = false) => {
    const variant = getRandomNumber(1, 2);

    if (entropy) {
      const definitions1 = findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
      ]).definitions;

      const variant1 =
        filterWords(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
          getDefinitionTuple('c', definitions1.c),
        ]).length *
        filterWords(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionTuple('c', definitions1.c),
        ]).length *
        (filterWords(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
          getDefinitionTuple('g', '*'),
        ]).length +
          filterWords(words, [
            getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
            getDefinitionTuple('p', DefinitionValue.PERSON.THIRD_PERSON),
          ]).length);

      const definitions2 = findWord(words, [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', DefinitionValue.CASE.ACCUSATIVE),
      ]).definitions;

      const variant2 =
        filterWords(words, [getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB)]).length *
        filterWords(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
          getDefinitionTuple('c', definitions2.c),
        ]).length *
        filterWords(words, [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionTuple('c', definitions2.c),
        ]).length;

      return calculateEntropy(variant1 + variant2);
    }

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
          getDefinitionTuple('g', definitions1.g),
          getDefinitionTuple('n', definitions1.n),
          getDefinitionTuple('c', definitions1.c),
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
          getDefinitionTuple('g', definitions2.g),
          getDefinitionTuple('n', definitions2.n),
          getDefinitionTuple('c', definitions2.c),
        ]);
      };

      return [verb, adjective, noun];
    }

    throw new Error('Invalid variant');
  }) as PresetFunction,
  4: ((words: Word[]) => {
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
          getDefinitionTuple('g', definitions1.g),
          getDefinitionTuple('n', definitions1.n),
          getDefinitionTuple('c', definitions1.c),
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
          getDefinitionTuple('g', definitions1.g),
          getDefinitionTuple('n', definitions1.n),
          getDefinitionTuple('c', definitions1.c),
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
          getDefinitionTuple('g', definitions2.g),
          getDefinitionTuple('n', definitions2.n),
          getDefinitionTuple('c', definitions2.c),
        ]);
      };

      return [noun, verb, adjective2, noun2];
    }

    throw new Error('Invalid variant');
  }) as PresetFunction, */
  5: (words: Word[]) => {
    const definitions1 = findWord(words, [
      getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
      getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
    ]).definitions;

    const adjective: PresetWordDefinition = [
      {
        base: [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
          getDefinitionTuple('c', definitions1.c),
        ],
        rest: [getDefinitionTuple('g', definitions1.g), getDefinitionTuple('n', definitions1.n)],
      },
    ];

    const noun: PresetWordDefinition = [
      {
        base: [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionTuple('c', definitions1.c),
        ],
        rest: [getDefinitionTuple('g', definitions1.g), getDefinitionTuple('n', definitions1.n)],
      },
    ];

    const verb: PresetWordDefinition = [
      {
        base: [getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB)],
        rest: [getDefinitionTuple('g', definitions1.g), getDefinitionTuple('n', definitions1.n)],
      },
      {
        base: [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
          getDefinitionTuple('p', DefinitionValue.PERSON.THIRD_PERSON),
        ],
        rest: [getDefinitionTuple('n', definitions1.n)],
      },
    ];

    const definitions2 = findWord(words, [
      getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
      getDefinitionTuple('c', DefinitionValue.CASE.ACCUSATIVE),
    ]).definitions;

    const adjective2: PresetWordDefinition = [
      {
        base: [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
          getDefinitionTuple('c', definitions2.c),
        ],
        rest: [getDefinitionTuple('g', definitions2.g), getDefinitionTuple('n', definitions2.n)],
      },
    ];

    const noun2: PresetWordDefinition = [
      {
        base: [
          getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
          getDefinitionTuple('c', definitions2.c),
        ],
        rest: [getDefinitionTuple('g', definitions2.g), getDefinitionTuple('n', definitions2.n)],
      },
    ];

    return [
      getWordFunctions(adjective),
      getWordFunctions(noun),
      getWordFunctions(verb),
      getWordFunctions(adjective2),
      getWordFunctions(noun2),
    ];
  },
};
