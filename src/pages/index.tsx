import { useForm } from '@tanstack/react-form';
import { readFile } from 'fs/promises';
import { round } from 'lodash-es';
import { GetStaticProps } from 'next';
import path from 'path';
import { useCallback, useEffect, useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import { usePrevious } from 'react-use';

import { EntropyLabel } from '@/components/index/EntropyLabel';
import PhraseWords from '@/components/index/PhraseWords';
import RefreshBox from '@/components/index/RefreshBox';
import { NumbersHighlighter } from '@/components/ui/NumbersHighlighter';
import Slider from '@/components/ui/Slider';
import { toDefinitions } from '@/utils/words/definitions';
import { getEntropyLevel } from '@/utils/words/entropy';
import { passwordize } from '@/utils/words/passwordize';
import { PresetLength, maxPresetLength, minPresetLength } from '@/utils/words/presets/cs';
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
  const [passphrase, setPassphrase] = useState<string>();
  const [entropyLabelExpanded, setEntropyLabelExpanded] = useState(false);

  const form = useForm({
    onSubmit: async ({ value }) => {
      const phraseOptionsChanged =
        filteredWordList.length === 0 ||
        previousFormValues?.maxWordLength !== value.maxWordLength ||
        previousFormValues.phraseLength !== form.state.values.phraseLength;
      const words =
        filteredWordList.length === 0 || previousFormValues?.maxWordLength !== value.maxWordLength
          ? wordList.filter((word) => word.value.length <= value.maxWordLength)
          : filteredWordList;
      setFilteredWordList(words);

      if (phraseOptionsChanged) {
        setPhrase(generatePhrase(words, form.state.values.phraseLength));
      }
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

  useEffect(() => {
    if (!wordList.length) {
      return;
    }

    form.handleSubmit({ initial: true });
  }, [form, wordList.length]);

  const updatePassphrase = useCallback(() => {
    if (!phrase) {
      return;
    }
    setPassphrase(
      passwordize(phraseToString(phrase), {
        numbers: form.state.values.numbers,
        firstLetter: 'randomize',
        diacritics: true,
        spaces: false,
      }),
    );
  }, [phrase, form.state.values.numbers]);

  useEffect(() => {
    updatePassphrase();
  }, [updatePassphrase, phrase, form.state.values.numbers]);

  const entropy =
    props.precalculatedEntropies[
      `${form.state.values.phraseLength}-${form.state.values.maxWordLength}`
    ] ?? 0;

  useEffect(() => {
    if (getEntropyLevel(round(entropy)) !== 'high') {
      setEntropyLabelExpanded(true);
    }
  }, [entropy]);

  {
    /* <div>
            {round(loadingProgress / 1024 / 1024, 1)} MB / {round(totalLength / 1024 / 1024, 1)} MB
          </div> */
  }

  if (!phrase) {
    return (
      <div>
        <div className="text-2xl font-semibold">Fráze</div>
        <div className="mt-6">
          <RefreshBox loading>
            <div className="invisible p-4">
              <FaSyncAlt className="h-7 w-7" />
            </div>
          </RefreshBox>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-14">
      <div>
        <div className="text-2xl font-semibold">Fráze</div>
        <div className="mt-6">
          <RefreshBox
            onButtonClick={() =>
              setPhrase(generatePhrase(filteredWordList, form.state.values.phraseLength))
            }
          >
            {phrase && (
              <div className="pt-4">
                <PhraseWords
                  phrase={phrase}
                  onWordClick={(idx) => {
                    setPhrase((prev) => {
                      const newPhrase = [...(prev ?? [])];
                      if (!newPhrase[idx]) {
                        return;
                      }
                      newPhrase[idx]!.word = newPhrase[idx].generate(filteredWordList);
                      return newPhrase;
                    });
                  }}
                />
              </div>
            )}
            {!phrase && <div className="text-center text-gray-500"></div>}
          </RefreshBox>
        </div>
        <div className="mt-7 flex gap-8">
          <div>
            <EntropyLabel
              entropy={entropy}
              words={filteredWordList.length}
              defaultExpanded={entropyLabelExpanded}
            />
          </div>
          <div className="flex w-full justify-between gap-8">
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
          </div>
        </div>
      </div>
      <div>
        <div className="text-2xl font-semibold">Heslo</div>
        <div className="mt-6">
          {phrase && passphrase && (
            <RefreshBox onButtonClick={() => updatePassphrase()}>
              <div className="pt-4 break-all">
                <NumbersHighlighter phrase={passphrase} />
              </div>
            </RefreshBox>
          )}
        </div>
        <div className="mt-7 flex w-full max-w-[240px] justify-between gap-8">
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

  const precalculatedEntropies: Record<string, number> = {};

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
