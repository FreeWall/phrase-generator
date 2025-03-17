export type DefinitionGroup = keyof typeof definitions;
export type Definitions<T extends DefinitionGroup = DefinitionGroup> = Record<
  T,
  keyof (typeof definitions)[T]
>;
export type DefinitionTuple<T extends DefinitionGroup = DefinitionGroup> = [
  T,
  keyof (typeof definitions)[T],
];

export const DefinitionValue = {
  CATEGORY: {
    NOUN: 1,
    ADJECTIVE: 2,
    VERB: 5,
    // ADVERB: 6,
  },
  GENDER: {
    FEMININE: 'F',
    MASCULINE_ANIMATE: 'M',
    MASCULINE_INANIMATE: 'I',
    NEUTER: 'N',
  },
  NUMBER: {
    SINGULAR: 'S',
    PLURAL: 'P',
  },
  CASE: {
    NOMINATIVE: 1,
    GENITIVE: 2,
    DATIVE: 3,
    ACCUSATIVE: 4,
    VOCATIVE: 5,
    LOCATIVE: 6,
    INSTRUMENTAL: 7,
  },
  MOOD: {
    PRESENT: 'A',
    PAST: 'I',
  },
  PERSON: {
    FIRST_PERSON: 1,
    SECOND_PERSON: 2,
    THIRD_PERSON: 3,
  },
} as const;

export const DefinitionCategoryColors = {
  [DefinitionValue.CATEGORY.NOUN]: '#5a7800',
  [DefinitionValue.CATEGORY.ADJECTIVE]: '#c77000',
  [DefinitionValue.CATEGORY.VERB]: '#970091',
};

const definitions = {
  k: {
    1: 'podstatné meno',
    2: 'prídavné meno',
    5: 'sloveso',
    // 6: 'příslovce',
  },
  g: {
    F: 'ženský',
    M: 'mužský životný',
    I: 'mužský neživotný',
    N: 'stredný',
  },
  n: {
    S: 'jednotné (singulár)',
    P: 'množné (plurál)',
  },
  c: {
    1: 'nominatív',
    2: 'genitív',
    3: 'datív',
    4: 'akuzatív',
    5: 'vokatív',
    6: 'lokál',
    7: 'inštrumentál',
  },
  m: {
    A: 'pritomne',
    I: 'minule',
  },
  p: {
    1: 'prvá osoba',
    2: 'druhá osoba',
    3: 'tretia osoba',
  },
} as const;

export function getDefinitionTuple<
  T extends DefinitionGroup,
  K extends keyof (typeof definitions)[T],
>(group: T, value: K): DefinitionTuple<T> {
  return [group, value];
}

export function getDefinition<T extends DefinitionGroup>(
  definitions: Definitions,
  group: T,
): Definitions<T>[T] {
  return definitions[group];
}

export function toDefinitions(content: string): Definitions {
  const definition: Definitions = {} as Definitions;
  for (let i = 0; i < content.length; i += 2) {
    const group = content[i] as DefinitionGroup;
    const value = content[i + 1] as keyof (typeof definitions)[DefinitionGroup];
    if (definitions[group]?.[value]) {
      definition[group] = value;
    }
  }
  return definition;
}
