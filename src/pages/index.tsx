import Button from '@/components/ui/button';
import { promiseAllSequence, sleep } from '@/utils/utils';
import {
  DefinitionValue,
  getDefinitionParam,
  toDefinitions,
} from '@/utils/words/definitions';
import {
  findWord,
  getVariant1,
  getVariant1Cached,
  Word,
  WordsByCategory,
} from '@/utils/words/words';
import { useQuery } from '@tanstack/react-query';
import { round, set } from 'lodash-es';
import { useEffect, useState } from 'react';

export default function Index() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [words, setWords] = useState<Word[]>([]);
  const [phrases, setPhrases] = useState<string[]>([]);
  const [wordsByCategory, setWordsByCategory] = useState<WordsByCategory>(
    {} as WordsByCategory,
  );

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

      const wordsByCategory: WordsByCategory = {
        [DefinitionValue.CATEGORY.NOUN]: [],
        [DefinitionValue.CATEGORY.ADJECTIVE]: [],
        [DefinitionValue.CATEGORY.VERB]: [],
        [DefinitionValue.CATEGORY.ADVERB]: [],
      } as WordsByCategory;
      words.forEach((word) => {
        wordsByCategory[word.definitions['k']]?.push(word);
      });
      setWordsByCategory(wordsByCategory);
    })();
  }, []);

  function generatePhrase() {
    (async () => {
      console.time('generatePhrase');
      setPhrases([]);
      await promiseAllSequence(Array.from({ length: 20 }), async () => {
        await sleep(10);
        const phrase = getVariant1Cached(wordsByCategory)
          .map((word) => word.value)
          .join(' ');

        setPhrases((prev) => [...prev, phrase]);
      });

      console.timeEnd('generatePhrase');
    })();
  }

  function passwordize(phrase: string) {
    phrase = phrase
      .split(' ')
      .map(
        (word) =>
          (Math.random() > 0.5 ? word[0]?.toUpperCase() : word[0]) +
          word.slice(1) +
          (Math.random() > 0.7 ? Math.floor(Math.random() * 10) : ''),
      )
      .join('');

    return phrase;
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
          onClick={generatePhrase}
          disabled={!words.length}
        >
          Generovat
        </Button>
        <div className="space-y-2 bg-white px-4 py-4 text-2xl dark:bg-lighter">
          {phrases.map((phrase) => (
            <div
              key={phrase}
              className="flex"
            >
              <div className="w-1/2">{phrase}</div>
              <div>{passwordize(phrase)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
