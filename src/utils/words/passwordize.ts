import { getRandomBoolean, getRandomNumber } from '@/utils/random';

export function passwordize(
  phrase: string,
  options?: {
    numbers?: number;
    firstLetter?: 'randomize' | 'lowercase' | 'uppercase';
    diacritics?: boolean;
  },
): string {
  const {
    numbers = 1,
    firstLetter = 'randomize',
    diacritics = true,
  } = options || {};
  const words = phrase
    .split(' ')
    .map((word) => {
      if (firstLetter == 'randomize') {
        return ''
          .concat(
            getRandomBoolean() ? word.charAt(0).toUpperCase() : word.charAt(0),
          )
          .concat(word.slice(1));
      }
      if (firstLetter == 'lowercase') {
        return ''.concat(word.charAt(0).toLowerCase()).concat(word.slice(1));
      }
      if (firstLetter == 'uppercase') {
        return ''.concat(word.charAt(0).toUpperCase()).concat(word.slice(1));
      }

      return word;
    })
    .map((word) =>
      diacritics ? word : word.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    );

  for (let i = 0; i < numbers; i++) {
    const idx = getRandomNumber(0, words.length - 1);
    words[idx] = words[idx]!.concat(getRandomNumber(0, 9).toString());
  }

  return words.join('');
}
