export const minRecommendedEntropy = 64;

export function calculateEntropy(uniqueWordsCount: number, phraseLength: number) {
  return Math.log2(Math.pow(uniqueWordsCount, phraseLength));
}
