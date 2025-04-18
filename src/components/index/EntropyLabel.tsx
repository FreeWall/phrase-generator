import { round } from 'lodash-es';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

import { formatLargeNumber, formatPeriod } from '@/utils/formats';
import { cn } from '@/utils/utils';
import {
  entropyToCombinations,
  getCrackTimeSeconds,
  getEntropyLevel,
  minEntropyLevels,
} from '@/utils/words/entropy';

const entropyLevelTextColors = {
  high: /** @tw */ 'text-green-700',
  medium: /** @tw */ 'text-amber-700',
  low: /** @tw */ 'text-red-700',
} as const satisfies Record<keyof typeof minEntropyLevels, string>;

const entropyLevelBgColors = {
  high: /** @tw */ 'bg-label-success',
  medium: /** @tw */ 'bg-label-warning',
  low: /** @tw */ 'bg-label-danger',
} as const satisfies Record<keyof typeof minEntropyLevels, string>;

const entropyLevelIcon = {
  high: <FaCheck />,
  medium: <FaExclamationTriangle />,
  low: <FaExclamationTriangle />,
} as const satisfies Record<keyof typeof minEntropyLevels, JSX.Element>;

export function EntropyLabel({ entropy, words }: { entropy: number; words: number }) {
  const combinations = entropyToCombinations(entropy);
  const timeToCrack = formatPeriod(getCrackTimeSeconds(entropy));
  const entropyLevel = getEntropyLevel(entropy);

  return (
    <div className={cn('w-[256px] rounded-lg', entropyLevelBgColors[entropyLevel])}>
      <div className="flex items-center justify-between border-b-2 border-b-white px-4 py-3 text-base font-medium">
        <div>
          Entropie fráze:{' '}
          <span className={cn('font-semibold', entropyLevelTextColors[entropyLevel])}>
            {round(entropy)}
          </span>
        </div>
        <div className={cn(entropyLevelTextColors[entropyLevel])}>
          {entropyLevelIcon[entropyLevel]}
        </div>
      </div>
      <div className="px-4 py-3 text-sm font-medium">
        <div>
          Slovník: <span className="font-semibold">{words.toLocaleString(undefined, {})} slov</span>
        </div>
        <div>
          Kombinací: <span className="font-semibold">{formatLargeNumber(combinations)}</span>
        </div>
        <div>
          Čas k prolomení: <span className="font-semibold">{timeToCrack}</span>
        </div>
      </div>
    </div>
  );
}
