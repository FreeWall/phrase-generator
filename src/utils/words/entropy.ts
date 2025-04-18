export const minRecommendedEntropy = 50;
export const minEntropyLevels = {
  high: 50,
  medium: 40,
  low: 30,
};

// PBKDF2: 600K: 0.2 ms
// PBKDF2: 2M: 0.66 ms

export function getEntropyLevel(entropy: number): keyof typeof minEntropyLevels {
  if (entropy >= minEntropyLevels.high) {
    return 'high';
  }
  if (entropy >= minEntropyLevels.medium) {
    return 'medium';
  }
  return 'low';
}

export function calculateEntropy(uniqueWordsCount: number) {
  return Math.log2(uniqueWordsCount);
}

export function entropyToCombinations(entropy: number) {
  return Math.pow(2, entropy);
}

export function getCrackTimeSeconds(entropy: number, hashTime: number = 0.2) {
  const combinations = entropyToCombinations(entropy) / 2;
  return (combinations * hashTime) / 1000;
}
