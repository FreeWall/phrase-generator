import { useForm } from '@tanstack/react-form';
import { readFile } from 'fs/promises';
import { GetStaticProps } from 'next';
import path from 'path';
import { Fragment, useEffect, useState } from 'react';
import { usePrevious } from 'react-use';

import { EntropyLabel } from '@/components/index/EntropyLabel';
import Button from '@/components/ui/Button';
import { NumbersHighlighter } from '@/components/ui/NumbersHighlighter';
import Slider from '@/components/ui/Slider';
import { TextTransition } from '@/components/ui/TextTransition';
import { DefinitionCategoryColors, toDefinitions } from '@/utils/words/definitions';
import { passwordize } from '@/utils/words/passwordize';
import { PresetLength, maxPresetLength, minPresetLength } from '@/utils/words/presets';
import {
  Phrase,
  Word,
  generatePhrase,
  getEntropy,
  phraseToString,
  wordLists,
} from '@/utils/words/words';

const shortestWordLength = 3;

interface IndexProps {
  precalculatedEntropies: Record<string, number>;
}

export default function Index(props: IndexProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [filteredWordList, setFilteredWordList] = useState<Word[]>([]);
  const [longestWordLength, setLongestWordLength] = useState(20);
  const [phrase, setPhrase] = useState<Phrase>();

  const form = useForm({
    onSubmit: async ({ value }) => {
      const words =
        filteredWordList.length === 0 || previousFormValues?.maxWordLength !== value.maxWordLength
          ? wordList.filter((word) => word.value.length <= value.maxWordLength)
          : filteredWordList;
      setFilteredWordList(words);

      generatePhrases(words);
    },
    onSubmitMeta: {} as { initial: boolean },
    defaultValues: {
      phraseLength: 5 as PresetLength,
      maxWordLength: longestWordLength,
      numbers: 1,
    },
  });

  const previousFormValues = usePrevious(form.state.values);

  useEffect(() => {
    (async () => {
      setTotalLength(0);
      setLoadingProgress(0);
      const words: Word[] = [];
      await Promise.all(
        wordLists.map(async (url) => {
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

    form.handleSubmit({ initial: true });
  }, [form, wordList.length]);

  const entropy =
    props.precalculatedEntropies[
      `${form.state.values.phraseLength}-${form.state.values.maxWordLength}`
    ] ?? 0;

  return (
    <div>
      <div className="w-[800px] space-y-4">
        <div className="mb-10">
          <div className="text-3xl font-semibold">Generátor frázového hesla</div>
          <div className="pt-1">
            Vytvořte si silné frázové heslo, které je snadno zapamatovatelné
          </div>
        </div>

        {/* <div>
            {round(loadingProgress / 1024 / 1024, 1)} MB / {round(totalLength / 1024 / 1024, 1)} MB
          </div> */}

        <EntropyLabel
          entropy={entropy}
          words={filteredWordList.length}
        />
        <Button
          onClick={() => generatePhrases(filteredWordList)}
          disabled={!wordList.length}
        >
          Generovat
        </Button>
        <div className="bg-darker space-y-2 rounded-lg px-8 py-8 text-2xl select-none">
          {phrase && renderPhrase(phrase)}
        </div>
        <div className="bg-darker space-y-2 rounded-lg px-8 py-8 text-2xl select-none">
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
                label={
                  <div>
                    Délka fráze: <span className="font-semibold">{field.state.value} slov</span>
                  </div>
                }
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
                label={
                  <div>
                    Max. délka slova:{' '}
                    <span className="font-semibold">{field.state.value} znaků</span>
                  </div>
                }
                min={shortestWordLength}
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
                label={
                  <div>
                    Počet číslic: <span className="font-semibold">{field.state.value}</span>
                  </div>
                }
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

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const words: Word[] = [];
  const precalculatedEntropies: Record<string, number> = {};

  await Promise.all(
    wordLists.map(async (file) => {
      const content = await readFile(path.join(process.cwd(), 'public', file), 'utf8');

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

  const longestWord = words.reduce((prev, curr) =>
    prev.value.length > curr.value.length ? prev : curr,
  );

  for (let wordLength = shortestWordLength; wordLength <= longestWord.value.length; wordLength++) {
    const filteredWords = words.filter((word) => word.value.length <= wordLength);
    for (
      let presetLength: PresetLength = minPresetLength;
      presetLength <= maxPresetLength;
      presetLength++
    ) {
      const entropy = getEntropy(filteredWords, presetLength);
      const key = `${presetLength}-${wordLength}`;
      precalculatedEntropies[key] = entropy;
    }
  }

  return {
    props: {
      precalculatedEntropies,
    },
  };
};
