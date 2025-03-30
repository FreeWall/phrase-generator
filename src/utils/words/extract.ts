import { shuffle } from 'lodash-es';

import { DefinitionValue, getDefinition, toDefinitions } from '@/utils/words/definitions';
import { Word } from '@/utils/words/words';

export async function extractWords() {
  const wordlists = [
    '/assets/words/cs/k12.txt',
    '/assets/words/cs/k5-min.txt',
    '/assets/words/cs/k5-prit.txt',
  ];

  const words: (Word & { word: string })[] = [];

  await Promise.all(
    wordlists.map(async (url) => {
      const response = await fetch(url);
      const content = await response.text();
      const lines = content.split('\n').filter((word) => !!word);

      for (const line of lines) {
        const parts = line.split(':');
        const word = parts[0];
        const value = parts[1];
        const definitions = parts[2];
        if (!word || !value || !definitions) {
          return;
        }
        words.push({
          word: word,
          value: value,
          definitions: toDefinitions(definitions),
        });
      }
    }),
  );

  const categories = {
    [DefinitionValue.CATEGORY.NOUN]: [],
    [DefinitionValue.CATEGORY.ADJECTIVE]: [],
    [DefinitionValue.CATEGORY.VERB]: [],
  };

  words.forEach((word) => {
    if (word.value.length > 20) {
      return;
    }

    const category = getDefinition(word.definitions, 'k');
    if (category === DefinitionValue.CATEGORY.NOUN) {
      if (
        getDefinition(word.definitions, 'c') !== DefinitionValue.CASE.NOMINATIVE &&
        getDefinition(word.definitions, 'c') !== DefinitionValue.CASE.ACCUSATIVE
      ) {
        return;
      }
      categories[DefinitionValue.CATEGORY.NOUN].push(word as never);
    } else if (category === DefinitionValue.CATEGORY.ADJECTIVE) {
      if (
        getDefinition(word.definitions, 'c') !== DefinitionValue.CASE.NOMINATIVE &&
        getDefinition(word.definitions, 'c') !== DefinitionValue.CASE.ACCUSATIVE
      ) {
        return;
      }
      categories[DefinitionValue.CATEGORY.ADJECTIVE].push(word as never);
    } else if (category === DefinitionValue.CATEGORY.VERB) {
      if (
        getDefinition(word.definitions, 'm') !== DefinitionValue.MOOD.PAST &&
        getDefinition(word.definitions, 'm') !== DefinitionValue.MOOD.PRESENT
      ) {
        return;
      }

      if (
        getDefinition(word.definitions, 'm') === DefinitionValue.MOOD.PRESENT &&
        getDefinition(word.definitions, 'p') !== DefinitionValue.PERSON.THIRD_PERSON
      ) {
        return;
      }

      categories[DefinitionValue.CATEGORY.VERB].push(word as never);
    }
  });

  for (const [category, words] of Object.entries(categories)) {
    // group words by word
    const grouped = words.reduce(
      (acc, word) => {
        if (!acc[word.word]) {
          acc[word.word] = [];
        }
        acc[word.word].push(word);
        return acc;
      },
      {} as Record<string, Word[]>,
    );

    const shuffledGrouped = shuffle(grouped);
    console.log(
      shuffledGrouped
        .flat()
        .map(
          (word) =>
            `${word.value},${Object.entries(word.definitions)
              .map(([key, value]) => `${key}${value}`)
              .join('')}`,
        )
        .join('\n'),
    );
  }

  return categories;
}
