import Button from '@/components/ui/button';
import { getRandomBoolean, getRandomNumber } from '@/utils/utils';
import { toDefinitions } from '@/utils/words/definitions';
import { generatePhrase, Word } from '@/utils/words/words';
import { round } from 'lodash-es';
import { useEffect, useState } from 'react';

export default function Index() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [words, setWords] = useState<Word[]>([]);
  const [phrases, setPhrases] = useState<string[]>([]);

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

      setWords(words);
    })();
  }, []);

  function generatePhrases() {
    (async () => {
      console.time('generatePhrases');
      setPhrases([]);
      Array.from({ length: 15 }).forEach(() => {
        const phrase = generatePhrase(words, 'short')
          .map((word) => word.value)
          .join(' ');

        setPhrases((prev) => [...prev, phrase]);
      });
      console.timeEnd('generatePhrases');
    })();
  }

  function passwordize(phrase: string) {
    const words = phrase.split(' ');
    const numberAfter = getRandomNumber(0, words.length - 1);
    return words.map((word, idx) => (
      <div
        key={idx}
        className="inline"
      >
        {getRandomBoolean() ? word[0]?.toUpperCase() : word[0]}
        {word.slice(1)}
        {numberAfter == idx ? (
          <div className="inline text-highlight">{getRandomNumber(0, 9)}</div>
        ) : (
          ''
        )}
      </div>
    ));
  }

  return (
    <div>
      <div className="flex flex-col gap-10 xl:flex-row">
        {round(loadingProgress / 1024 / 1024, 1)} MB /{' '}
        {round(totalLength / 1024 / 1024, 1)} MB
      </div>
      <div className="space-y-4">
        <div>{words.length.toLocaleString(undefined, {})} words</div>
        <Button
          onClick={generatePhrases}
          disabled={!words.length}
        >
          Generovat
        </Button>
        <div className="space-y-2 bg-darker px-4 py-4 text-2xl">
          {phrases.map((phrase) => (
            <div
              key={phrase}
              className="flex"
            >
              <div className="w-1/2">{phrase}</div>
              <div className="">{passwordize(phrase)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
