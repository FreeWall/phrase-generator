import Button from '@/components/ui/button';
import { TextTransition } from '@/components/ui/textTransition';
import { getRandomBoolean, getRandomNumber } from '@/utils/utils';
import {
  DefinitionCategoryColors,
  toDefinitions,
} from '@/utils/words/definitions';
import { generatePhrase, Phrase, Word } from '@/utils/words/words';
import { round } from 'lodash-es';
import { Fragment, useEffect, useState } from 'react';

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
                className="group/words hover:!text-highlight"
              >
                {words.map((word, idx) => (
                  <div
                    key={idx}
                    className="inline group-hover/words:inline group-hover/phrase:hidden"
                  >
                    {word.value}
                    {idx < words.length - 1 ? ' ' : ''}
                  </div>
                ))}
                {words.map((word, idx) => (
                  <div
                    key={idx}
                    className="hidden group-hover/phrase:inline group-hover/words:hidden"
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

  function phraseToString(phrase: Phrase): string {
    return phrase
      .map(({ words }) => words.map((word) => word.value).join(' '))
      .join(' ');
  }

  function passwordize(
    phrase: string,
    options?: {
      numbers?: number;
      firstLetter?: 'randomize' | 'lowercase' | 'uppercase';
      diacritics?: boolean;
    },
  ) {
    const {
      numbers = 1,
      firstLetter = 'randomize',
      diacritics = true,
    } = options || {};
    const words = phrase
      .split(' ')
      .map((word) => {
        if (firstLetter == 'randomize') {
          return ''
            .concat(
              getRandomBoolean()
                ? word.charAt(0).toUpperCase()
                : word.charAt(0),
            )
            .concat(word.slice(1));
        }
        if (firstLetter == 'lowercase') {
          return ''.concat(word.charAt(0).toLowerCase()).concat(word.slice(1));
        }
        if (firstLetter == 'uppercase') {
          return ''.concat(word.charAt(0).toUpperCase()).concat(word.slice(1));
        }

        return word;
      })
      .map((word) =>
        diacritics
          ? word
          : word.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      );

    for (let i = 0; i < numbers; i++) {
      const idx = getRandomNumber(0, words.length - 1);
      const num = getRandomNumber(0, 9);
      words[idx] = words[idx]!.concat(num.toString());
    }

    return words.join('');
  }

  function highlightNumbers(phrase: string) {
    const parts = phrase.split(/(\d+)/);
    return (
      <div>
        {parts.map((part, idx) =>
          /^\d+$/.test(part) ? (
            <span
              key={idx}
              className="text-highlight"
            >
              {part}
            </span>
          ) : (
            <span key={idx}>{part}</span>
          ),
        )}
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
        <div className="group/phrase select-none space-y-2 rounded-lg bg-darker px-6 py-6 text-2xl font-medium">
          {phrase && renderPhrase(phrase)}
        </div>
        <div className="select-none space-y-2 rounded-lg bg-darker px-6 py-6 text-2xl font-medium">
          {phrase &&
            highlightNumbers(
              passwordize(phraseToString(phrase), {
                numbers: 2,
                firstLetter: 'randomize',
                diacritics: true,
              }),
            )}
        </div>
      </div>
    </div>
  );
}
