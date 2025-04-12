import { useForm } from '@tanstack/react-form';
import { round } from 'lodash-es';
import { Fragment, useEffect, useState } from 'react';
import { usePrevious } from 'react-use';

import Button from '@/components/ui/Button';
import { NumbersHighlighter } from '@/components/ui/NumbersHighlighter';
import Slider from '@/components/ui/Slider';
import { TextTransition } from '@/components/ui/TextTransition';
import { cn } from '@/utils/utils';
import { DefinitionCategoryColors, toDefinitions } from '@/utils/words/definitions';
import {
  entropyToCombinations,
  getCrackTime,
  getCrackTimeString,
  minRecommendedEntropy,
} from '@/utils/words/entropy';
import { passwordize } from '@/utils/words/passwordize';
import { PresetLength } from '@/utils/words/presets';
import {
  Phrase,
  Word,
  generatePhrase,
  getEntropy,
  maxPresetLength,
  minPresetLength,
  phraseToString,
} from '@/utils/words/words';

export default function Index() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [filteredWordList, setFilteredWordList] = useState<Word[]>([]);
  const [longestWordLength, setLongestWordLength] = useState(20);
  const [phrase, setPhrase] = useState<Phrase>();
  const [entropy, setEntropy] = useState(0);

  const form = useForm({
    onSubmit: async ({ value }) => {
      const words =
        filteredWordList.length === 0 || previousFormValues?.maxWordLength !== value.maxWordLength
          ? wordList.filter((word) => word.value.length <= value.maxWordLength)
          : filteredWordList;
      setFilteredWordList(words);

      if (
        previousFormValues?.maxWordLength !== value.maxWordLength ||
        previousFormValues?.phraseLength !== value.phraseLength
      ) {
        setEntropy(getEntropy(words, value.phraseLength));
      }

      generatePhrases(words);
    },
    defaultValues: {
      phraseLength: 5 as PresetLength,
      maxWordLength: longestWordLength,
      numbers: 1,
    },
  });

  const previousFormValues = usePrevious(form.state.values);

  useEffect(() => {
    (async () => {
      const wordlists = [
        '/assets/words/cs/k1.txt',
        '/assets/words/cs/k2.txt',
        '/assets/words/cs/k5.txt',
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
            const parts = line.split(',');
            const word = parts[0];
            const definitions = parts[1];
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

      const longestWord = words.reduce((prev, curr) =>
        prev.value.length > curr.value.length ? prev : curr,
      );
      setLongestWordLength(longestWord.value.length);
    })();
  }, []);

  function generatePhrases(words: Word[]) {
    const phrase = generatePhrase(words, form.state.values.phraseLength);
    setPhrase(phrase);
  }

  function renderPhrase(phrase: Phrase) {
    return (
      <div>
        {phrase.map(({ word, generate }, idx) => {
          return (
            <Fragment key={idx}>
              <TextTransition
                key={idx}
                inline
                translateValue="0%"
              >
                <div
                  key={idx}
                  className="cursor-pointer hover:underline"
                  onClick={() =>
                    setPhrase((prev) => {
                      const newPhrase = [...(prev ?? [])];
                      newPhrase[idx]!.word = generate(filteredWordList);
                      return newPhrase;
                    })
                  }
                  style={{
                    color: DefinitionCategoryColors[word.definitions.k],
                  }}
                >
                  {word.value}
                </div>
              </TextTransition>
              {idx < phrase.length - 1 ? ' ' : ''}
            </Fragment>
          );
        })}
      </div>
    );
  }

  useEffect(() => {
    if (!wordList.length) {
      return;
    }

    form.handleSubmit();
  }, [form, wordList.length]);

  return (
    <div>
      <div className="w-[800px] space-y-4">
        <div className="text-base">
          <div>
            {round(loadingProgress / 1024 / 1024, 1)} MB / {round(totalLength / 1024 / 1024, 1)} MB
          </div>
          <div>{filteredWordList.length.toLocaleString(undefined, {})} slov</div>
          <div>
            entropie:{' '}
            <span className={cn({ 'text-red-600': round(entropy) < minRecommendedEntropy })}>
              {round(entropy)} bits
            </span>
          </div>
          <div>
            <span className="text-highlight font-medium">
              {round(entropyToCombinations(entropy)).toLocaleString(undefined, {})}
            </span>{' '}
            možných kombinací
          </div>
          <div>
            <span className="text-highlight font-medium">
              {getCrackTimeString(getCrackTime(entropy))}
            </span>{' '}
            k prolomení
          </div>
        </div>
        <Button
          onClick={() => generatePhrases(filteredWordList)}
          disabled={!wordList.length}
        >
          Generovat
        </Button>
        <div className="bg-darker space-y-2 rounded-lg px-8 py-8 text-2xl font-medium select-none">
          {phrase && renderPhrase(phrase)}
        </div>
        <div className="bg-darker space-y-2 rounded-lg px-8 py-8 text-2xl font-medium select-none">
          {phrase && (
            <NumbersHighlighter
              phrase={passwordize(phraseToString(phrase), {
                numbers: form.state.values.numbers,
                firstLetter: 'randomize',
                diacritics: true,
                spaces: false,
              })}
            />
          )}
        </div>
        <div className="flex gap-8">
          <form.Field name="phraseLength">
            {(field) => (
              <Slider
                className="w-full"
                label={<div>Délka fráze: {field.state.value} slov</div>}
                min={minPresetLength}
                max={maxPresetLength}
                value={field.state.value}
                onChange={(value) => {
                  field.handleChange(value as PresetLength);
                  form.handleSubmit();
                }}
              />
            )}
          </form.Field>
          <form.Field name="maxWordLength">
            {(field) => (
              <Slider
                className="w-full"
                label={<div>Max. délka slova: {field.state.value} znaků</div>}
                min={3}
                max={longestWordLength}
                value={field.state.value}
                onChange={(value) => {
                  field.handleChange(value);
                  form.handleSubmit();
                }}
              />
            )}
          </form.Field>
          <form.Field name="numbers">
            {(field) => (
              <Slider
                className="w-full"
                label={<div>Počet číslic: {field.state.value}</div>}
                min={0}
                max={10}
                value={field.state.value}
                onChange={(value) => {
                  field.handleChange(value);
                  form.handleSubmit();
                }}
              />
            )}
          </form.Field>
        </div>
      </div>
    </div>
  );
}
