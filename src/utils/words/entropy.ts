export const minRecommendedEntropy = 50;

// PBKDF2: 600K: 0.2 ms
// PBKDF2: 2M: 0.66 ms

export function calculateEntropy(uniqueWordsCount: number) {
  return Math.log2(uniqueWordsCount);
}

export function entropyToCombinations(entropy: number) {
  return Math.pow(2, entropy);
}

export function getCrackTime(entropy: number, hashTime: number = 0.2) {
  const combinations = entropyToCombinations(entropy) / 2;
  const time = (combinations * hashTime) / 1000;
  return time;
}

export function getCrackTimeString(number: number) {
  if (number < 120) {
    return getNumberWords(number) + ' sekund';
  }
  const hour = 60 * 60;
  if (number < hour) {
    return getNumberWords(number / 60) + ' minut';
  }
  const day = hour * 24;
  if (number < 2 * day) {
    return getNumberWords(number / hour) + ' hodin';
  }
  const month = day * 30;
  if (number < month) {
    return getNumberWords(number / day) + ' dní';
  }
  const year = day * 365;
  if (number < year) {
    return getNumberWords(number / month) + ' měsíců';
  }
  const century = year * 100;
  if (number < century * 10) {
    return getNumberWords(number / year) + ' let';
  }
  if (number < century * 100) {
    return getNumberWords(number / century) + ' století';
  }

  return getNumberWords(number / year) + ' let';
}

function getNumberWords(number: number) {
  let numberWords = '';
  const trillion = Math.pow(10, 12);
  const billion = Math.pow(10, 9);
  const million = Math.pow(10, 6);
  const thousand = Math.pow(10, 4);
  const hundred = Math.pow(10, 3);
  while (number / trillion >= 1) {
    numberWords = ' bilion ' + numberWords;
    number = number / trillion;
  }
  while (number / billion >= 1) {
    numberWords = ' miliard ' + numberWords;
    number = number / billion;
  }
  while (number / million >= 1) {
    numberWords = ' million ' + numberWords;
    number = number / million;
  }
  while (number / thousand >= 1) {
    numberWords = ' tisíc ' + numberWords;
    number = number / thousand;
  }
  while (number / hundred >= 1) {
    numberWords = ' set ' + numberWords;
    number = number / hundred;
  }
  number = Math.round(number);
  numberWords = number + numberWords;
  return numberWords;
}
