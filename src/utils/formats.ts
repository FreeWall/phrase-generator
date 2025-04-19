const numberSeries = [
  [30, ['quintillion', 'quintilliony', 'quintillionů']], // 10^30
  [27, ['kvadriliarda', 'kvadriliardy', 'kvadriliard']], // 10^27
  [24, ['kvadrilion', 'kvadriliony', 'kvadrilionů']], // 10^24
  [21, ['triliarda', 'triliardy', 'triliard']], // 10^21
  [18, ['trilion', 'triliony', 'trilionů']], // 10^18
  [15, ['biliarda', 'biliardy', 'biliard']], // 10^15
  [12, ['bilion', 'biliony', 'bilionů']], // 10^12
  [9, ['miliarda', 'miliardy', 'miliard']], // 10^9
  [6, ['milion', 'miliony', 'milionů']], // 10^6
  [3, ['tisíc', 'tisíce', 'tisíc']], // 10^3
] as const;

function pluralize(n: number, forms: readonly [string, string, string]) {
  let form = 2;
  if (n == 1) {
    form = 0;
  } else if (n > 1 && n < 5) {
    form = 1;
  }
  return forms[form];
}

export function formatLargeNumber(number: number) {
  for (const series of numberSeries) {
    const limit = Math.pow(10, Number(series[0]));
    if (number >= limit) {
      const value = Math.round(number / Math.pow(10, Number(series[0])));
      return `${value} ${pluralize(value, series[1])}`;
    }
  }

  return Math.round(number);
}

const periodWords: Record<number, readonly [string, string, string]> = {
  1: ['sekunda', 'sekundy', 'sekund'],
  60: ['minuta', 'minuty', 'minut'],
  [60 * 60]: ['hodina', 'hodiny', 'hodin'],
  [60 * 60 * 24]: ['den', 'dny', 'dní'],
  [60 * 60 * 24 * 30]: ['měsíc', 'měsíce', 'měsíců'],
  [60 * 60 * 24 * 365]: ['rok', 'roky', 'let'],
} as const;

const periods = [
  { limit: 120, unit: 1 },
  { limit: 60 * 60, unit: 60 },
  { limit: 60 * 60 * 24 * 2, unit: 60 * 60 },
  { limit: 60 * 60 * 24 * 30, unit: 60 * 60 * 24 },
  { limit: 60 * 60 * 24 * 365, unit: 60 * 60 * 24 * 30 },
];

export function formatPeriod(number: number) {
  for (const period of periods) {
    if (number < period.limit) {
      const value = Math.round(number / period.unit);
      return `${value} ${pluralize(value, periodWords[period.unit]!)}`;
    }
  }

  const year = 60 * 60 * 24 * 365;
  const value = Math.round(number / year);
  return `${formatLargeNumber(value)} ${pluralize(value, periodWords[year]!)}`;
}
