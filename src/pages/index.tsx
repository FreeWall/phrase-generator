import { round } from 'lodash-es';
import Slider from 'rc-slider';
import { Fragment, useEffect, useState } from 'react';

import Button from '@/components/ui/button';
import { NumbersHighlighter } from '@/components/ui/numbersHighlighter';
import { TextTransition } from '@/components/ui/textTransition';
import {
  DefinitionCategoryColors,
  toDefinitions,
} from '@/utils/words/definitions';
import { passwordize } from '@/utils/words/passwordize';
import {
  Phrase,
  Word,
  generatePhrase,
  phraseToString,
} from '@/utils/words/words';

export default function Index() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [phrase, setPhrase] = useState<Phrase>();

  useEffect(() => {
    (async () => {
      const wordlists = [
        '/assets/words/cs/k5-min.txt',
        '/assets/words/cs/k5-prit.txt',
        '/assets/words/cs/k6.txt',
        '/assets/words/cs/k12.txt',
      ];
      setTotalLength(0);
      setLoadingProgress(0);
      const words: Word[] = [];
      await Promise.all(
        wordlists.map(async (url) => {
          const response = await fetch(url);

          const reader = response.body?.getReader();
          if (!reader) {
            return;
          }

          const contentLength = response.headers.get('Content-Length');
          setTotalLength((prev) => prev + Number(contentLength));

          let content = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }

            content += new TextDecoder().decode(value);
            setLoadingProgress((prev) => prev + value.length);
          }

          const lines = content.split('\n').filter((word) => !!word);

          for (const line of lines) {
            const parts = line.split(':');
            const word = parts[1];
            const definitions = parts[2];
            if (!word || !definitions) {
              return;
            }
            words.push({
              value: word,
              definitions: toDefinitions(definitions),
            });
          }
        }),
      );

      setWordList(words);
    })();
  }, []);

  function generatePhrases() {
    (async () => {
      console.time('generatePhrases');
      const phrase = generatePhrase(wordList, 'longest');
      setPhrase(phrase);
      console.timeEnd('generatePhrases');
    })();
  }

  function renderPhrase(phrase: Phrase) {
    return (
      <div>
        {phrase.map(({ words, generate }, idx) => (
          <Fragment key={idx}>
            <div
              key={idx}
              className="inline cursor-pointer"
              onClick={() =>
                setPhrase((prev) => {
                  const newPhrase = [...(prev ?? [])];
                  newPhrase[idx]!.words = generate(wordList);
                  return newPhrase;
                })
              }
            >
              <TextTransition
                translateValue="0%"
                inline
                className="group/words hover:text-highlight"
              >
                {words.map((word, idx) => (
                  <div
                    key={idx}
                    className="hidden group-hover/phrase:hidden group-hover/words:inline"
                  >
                    {word.value}
                    {idx < words.length - 1 ? ' ' : ''}
                  </div>
                ))}
                {words.map((word, idx) => (
                  <div
                    key={idx}
                    className="inline group-hover/phrase:inline group-hover/words:hidden"
                    style={{
                      color: DefinitionCategoryColors[word.definitions.k],
                    }}
                  >
                    {word.value}
                    {idx < words.length - 1 ? ' ' : ''}
                  </div>
                ))}
              </TextTransition>
            </div>
            {idx < phrase.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-10 xl:flex-row">
        {round(loadingProgress / 1024 / 1024, 1)} MB /{' '}
        {round(totalLength / 1024 / 1024, 1)} MB
      </div>
      <div className="space-y-4">
        <div>{wordList.length.toLocaleString(undefined, {})} words</div>
        <Button
          onClick={generatePhrases}
          disabled={!wordList.length}
        >
          Generovat
        </Button>
        <div className="group/phrase bg-darker space-y-2 rounded-lg px-8 py-8 text-2xl font-medium select-none">
          {phrase && renderPhrase(phrase)}
        </div>
        <div className="bg-darker space-y-2 rounded-lg px-8 py-8 text-2xl font-medium select-none">
          {phrase && (
            <NumbersHighlighter
              phrase={passwordize(phraseToString(phrase), {
                numbers: 2,
                firstLetter: 'randomize',
                diacritics: true,
              })}
            />
          )}
        </div>
        <div className="w-[220px]">
          <Slider
            min={2}
            max={5}
            step={1}
            dots
            className="relative w-full touch-none select-none"
            classNames={{
              handle:
                /** @tw */ 'absolute bg-text rounded-full w-5 h-5 -mt-1.5 cursor-grab',
              track: /** @tw */ 'absolute h-2 bg-text rounded-full',
              rail: /** @tw */ 'absolute w-full h-2 bg-darker rounded-full',
            }}
            onChange={(values) => {}}
            onChangeComplete={(values) => {}}
            styles={{
              track: {},
            }}
            activeDotStyle={{
              border: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
