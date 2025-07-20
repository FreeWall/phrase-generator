import { Fragment } from 'react';

import { TextTransition } from '@/components/ui/TextTransition';
import { WordsHistory } from '@/pages';
import { DefinitionCategoryColors } from '@/utils/words/definitions';
import { Phrase, Word } from '@/utils/words/words';

interface PhraseProps {
  phrase: Phrase;
  wordsHistory: WordsHistory;
  onWordClick: (idx: number) => void;
  onHistoryWordClick: (idx: number, word: Word) => void;
}

export default function PhraseWords(props: PhraseProps) {
  return props.phrase.map(({ word }, idx) => {
    return (
      <Fragment key={idx}>
        <TextTransition
          key={idx}
          value={word.value}
        >
          <div className="group relative">
            <div
              key={idx}
              className="cursor-pointer hover:underline"
              onClick={() => props.onWordClick(idx)}
              onMouseDown={(event) => event.preventDefault()}
              style={{
                color: DefinitionCategoryColors[word.definitions.k],
              }}
            >
              {word.value}
            </div>
            {Number(props.wordsHistory[idx]?.length) > 0 && (
              <div
                className="border-body/70 absolute bottom-8 -left-4 hidden py-2 text-base group-hover:block"
                style={{
                  color: DefinitionCategoryColors[word.definitions.k],
                }}
              >
                <div className="pointer-events-none absolute bottom-10 z-0 h-[calc(100%-40px)] w-full bg-white"></div>
                {props.wordsHistory[idx]?.slice(-5)?.map((word) => (
                  <div
                    key={word.value}
                    className="relative z-10 cursor-pointer px-4 opacity-60 hover:underline hover:opacity-100"
                    onClick={() => props.onHistoryWordClick(idx, word)}
                  >
                    {word.value}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TextTransition>
        {idx < props.phrase.length - 1 ? ' ' : ''}
      </Fragment>
    );
  });
}
