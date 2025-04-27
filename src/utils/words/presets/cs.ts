import { DefinitionValue, Definitions, getDefinitionTuple } from '@/utils/words/definitions';
import { PresetWordDefinitions, Word, findWord, getWordFunctions } from '@/utils/words/words';

export type PresetLength = keyof typeof presets;

function getAdjectiveNoun(
  definitions: Definitions,
): [PresetWordDefinitions, PresetWordDefinitions] {
  const adjective: PresetWordDefinitions = [
    {
      base: [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.ADJECTIVE),
        getDefinitionTuple('c', definitions.c),
      ],
      rest: [getDefinitionTuple('g', definitions.g), getDefinitionTuple('n', definitions.n)],
    },
  ];

  const noun: PresetWordDefinitions = [
    {
      base: [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
        getDefinitionTuple('c', definitions.c),
      ],
      rest: [getDefinitionTuple('g', definitions.g), getDefinitionTuple('n', definitions.n)],
    },
  ];

  return [adjective, noun];
}

function getVerb(definitions: Definitions): PresetWordDefinitions {
  return [
    {
      base: [getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB)],
      rest: [getDefinitionTuple('g', definitions.g), getDefinitionTuple('n', definitions.n)],
    },
    {
      base: [
        getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB),
        getDefinitionTuple('p', DefinitionValue.PERSON.THIRD_PERSON),
      ],
      rest: [getDefinitionTuple('n', definitions.n)],
    },
  ];
}

export const presets = {
  2: (words: Word[]) => {
    const definitions1 = findWord(words, [
      getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
      getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
    ]).definitions;

    const adjectiveNoun = getAdjectiveNoun(definitions1);

    return [[getWordFunctions(adjectiveNoun[0]), getWordFunctions(adjectiveNoun[1])]];
  },
  3: (words: Word[]) => {
    const definitions1 = findWord(words, [
      getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
      getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
    ]).definitions;

    const definitions2 = findWord(words, [
      getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
      getDefinitionTuple('c', DefinitionValue.CASE.ACCUSATIVE),
    ]).definitions;

    const adjectiveNoun = getAdjectiveNoun(definitions1);
    const adjectiveNoun2 = getAdjectiveNoun(definitions2);

    return [
      [
        getWordFunctions(adjectiveNoun[0]),
        getWordFunctions(adjectiveNoun[1]),
        getWordFunctions(getVerb(definitions1)),
      ],
      [
        getWordFunctions([
          {
            base: [getDefinitionTuple('k', DefinitionValue.CATEGORY.VERB)],
            rest: [],
          },
        ]),
        getWordFunctions(adjectiveNoun2[0]),
        getWordFunctions(adjectiveNoun2[1]),
      ],
    ];
  },
  4: (words: Word[]) => {
    const definitions1 = findWord(words, [
      getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
      getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
    ]).definitions;

    const adjectiveNoun = getAdjectiveNoun(definitions1);

    const definitions2 = findWord(words, [
      getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
      getDefinitionTuple('c', DefinitionValue.CASE.ACCUSATIVE),
    ]).definitions;

    const adjectiveNoun2 = getAdjectiveNoun(definitions2);

    return [
      [
        getWordFunctions(adjectiveNoun[0]),
        getWordFunctions(adjectiveNoun[1]),
        getWordFunctions(getVerb(definitions1)),
        getWordFunctions(adjectiveNoun2[1]),
      ],
      [
        getWordFunctions(adjectiveNoun[1]),
        getWordFunctions(getVerb(definitions1)),
        getWordFunctions(adjectiveNoun2[0]),
        getWordFunctions(adjectiveNoun2[1]),
      ],
    ];
  },
  5: (words: Word[]) => {
    const definitions1 = findWord(words, [
      getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
      getDefinitionTuple('c', DefinitionValue.CASE.NOMINATIVE),
    ]).definitions;

    const adjectiveNoun = getAdjectiveNoun(definitions1);

    const definitions2 = findWord(words, [
      getDefinitionTuple('k', DefinitionValue.CATEGORY.NOUN),
      getDefinitionTuple('c', DefinitionValue.CASE.ACCUSATIVE),
    ]).definitions;

    const adjectiveNoun2 = getAdjectiveNoun(definitions2);

    return [
      [
        getWordFunctions(adjectiveNoun[0]),
        getWordFunctions(adjectiveNoun[1]),
        getWordFunctions(getVerb(definitions1)),
        getWordFunctions(adjectiveNoun2[0]),
        getWordFunctions(adjectiveNoun2[1]),
      ],
    ];
  },
};

export const minPresetLength = Math.min(
  ...(Object.keys(presets) as unknown as number[]),
) as PresetLength;
export const maxPresetLength = Math.max(
  ...(Object.keys(presets) as unknown as number[]),
) as PresetLength;
