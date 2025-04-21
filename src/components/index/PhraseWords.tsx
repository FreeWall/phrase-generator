import { Fragment } from 'react';

import { TextTransition } from '@/components/ui/TextTransition';
import { DefinitionCategoryColors } from '@/utils/words/definitions';
import { Phrase } from '@/utils/words/words';

interface PhraseProps {
  phrase: Phrase;
  onWordClick: (idx: number) => void;
}

export default function PhraseWords(props: PhraseProps) {
  return props.phrase.map(({ word }, idx) => {
    return (
      <Fragment key={idx}>
        <TextTransition
          key={idx}
          value={word.value}
        >
          <div
            key={idx}
            className="cursor-pointer hover:underline"
            onClick={() => props.onWordClick(idx)}
            style={{
              color: DefinitionCategoryColors[word.definitions.k],
            }}
          >
            {word.value}
          </div>
        </TextTransition>
        {idx < props.phrase.length - 1 ? ' ' : ''}
      </Fragment>
    );
  });
}
