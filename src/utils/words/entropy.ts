export const minRecommendedEntropy = 64;

// PBKDF2: 600K: 0.2 ms
// PBKDF2: 2M: 0.66 ms

export function calculateEntropy(uniqueWordsCount: number, phraseLength: number = 1) {
  return Math.log2(Math.pow(uniqueWordsCount, phraseLength));
}

export function entropyToCombinations(entropy: number) {
  return Math.pow(2, entropy);
}
