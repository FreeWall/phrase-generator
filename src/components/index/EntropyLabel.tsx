import { AnimatePresence, cubicBezier, motion } from 'framer-motion';
import { round } from 'lodash-es';
import { useEffect, useState } from 'react';
import { FaAngleDown, FaAngleUp, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

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

export function EntropyLabel({
  entropy,
  words,
  defaultExpanded = false,
}: {
  entropy: number;
  words: number;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const combinations = entropyToCombinations(entropy);
  const timeToCrack = formatPeriod(getCrackTimeSeconds(entropy));
  const entropyLevel = getEntropyLevel(round(entropy));

  useEffect(() => {
    if (defaultExpanded) {
      setExpanded(true);
    }
  }, [defaultExpanded]);

  return (
    <div
      className="group flex w-[256px] cursor-pointer flex-col"
      onClick={() => {
        if (defaultExpanded) {
          setExpanded((prev) => !prev);
          return;
        }
        setExpanded((prev) => !prev);
      }}
    >
      <div className={cn('rounded-lg', entropyLevelBgColors[entropyLevel])}>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            Entropie fráze:{' '}
            <span className={cn('font-semibold', entropyLevelTextColors[entropyLevel])}>
              {round(entropy)} bitů
            </span>
          </div>
          <div className={cn(entropyLevelTextColors[entropyLevel], 'text-xl')}>
            {entropyLevelIcon[entropyLevel]}
          </div>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              exit={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3, ease: cubicBezier(0.16, 1, 0.3, 1) }}
              className="overflow-hidden"
            >
              <div className="border-t-2 border-t-white px-4 py-3 text-sm leading-5.5">
                <div>
                  Slovník:{' '}
                  <span className="font-semibold">{words.toLocaleString(undefined, {})} slov</span>
                </div>
                <div>
                  Kombinací:{' '}
                  <span className="font-semibold">{formatLargeNumber(combinations)}</span>
                </div>
                <div>
                  Čas k prolomení: <span className="font-semibold">{timeToCrack}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-center">
        <div
          className={cn(
            'absolute -mt-4 flex w-[40px] justify-center rounded-b-lg pb-0.5 text-lg opacity-0 group-hover:-mt-2.5 group-hover:opacity-100',
            entropyLevelBgColors[entropyLevel],
          )}
          style={{
            transition:
              'margin-top 0.2s cubic-bezier(0.3, 1, 0.5, 1), opacity 0.2s cubic-bezier(0.3, 1, 0.5, 1)',
          }}
        >
          {expanded ? <FaAngleUp /> : <FaAngleDown />}
        </div>
      </div>
    </div>
  );
}
