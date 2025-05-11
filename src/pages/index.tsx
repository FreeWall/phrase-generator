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
import Switch from '@/components/ui/Switch';
import { useStorageStore } from '@/stores/storage';
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
  longestWordLength: number;
  precalculatedEntropies: Record<string, number>;
}

export default function Index(props: IndexProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [filteredWordList, setFilteredWordList] = useState<Word[]>([]);
  const [phrase, setPhrase] = useState<Phrase>();
  const [passphrase, setPassphrase] = useState<string>();
  const [entropyLabelExpanded, setEntropyLabelExpanded] = useState(false);

  const [phraseOptions, setPhraseOptions] = useStorageStore((state) => [
    state.phraseOptions,
    state.setPhraseOptions,
  ]);

  const [passwordizeOptions, setPasswordizeOptions] = useStorageStore((state) => [
    state.passwordizeOptions,
    state.setPasswordizeOptions,
  ]);

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
      phraseLength: phraseOptions.phraseLength ?? maxPresetLength,
      maxWordLength: phraseOptions.maxWordLength ?? props.longestWordLength,
      digits: passwordizeOptions.digits ?? 1,
      diacritics: passwordizeOptions.diacritics ?? false,
      spaces: passwordizeOptions.spaces ?? false,
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
        digits: form.state.values.digits,
        firstLetter: undefined,
        diacritics: form.state.values.diacritics,
        spaces: form.state.values.spaces,
      }),
    );
  }, [phrase, form.state.values]);

  useEffect(() => {
    updatePassphrase();
  }, [updatePassphrase, phrase, form.state.values.digits]);

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
            <div className="invisible p-5">
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
              <div
                className="pt-5"
                onCopy={(event) => {
                  const text = document.getSelection()?.toString().replaceAll('\n', '');
                  if (!text) {
                    return;
                  }
                  event.clipboardData.setData('text/plain', text);
                  event.preventDefault();
                }}
              >
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
              forceExpand={entropyLabelExpanded}
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
                    setPhraseOptions((prev) => ({
                      ...prev,
                      phraseLength: value as PresetLength,
                    }));
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
                  max={props.longestWordLength}
                  value={field.state.value}
                  onChange={(value) => {
                    setPhraseOptions((prev) => ({
                      ...prev,
                      maxWordLength: value,
                    }));
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
              <div className="pt-5 break-all">
                <NumbersHighlighter phrase={passphrase} />
              </div>
            </RefreshBox>
          )}
        </div>
        <div className="mt-7 flex w-full items-end gap-8">
          <form.Field name="digits">
            {(field) => (
              <Slider
                className="w-[240px]"
                label={
                  <div>
                    Počet číslic: <span className="font-semibold">{field.state.value}</span>
                  </div>
                }
                min={0}
                max={10}
                value={field.state.value}
                onChange={(value) => {
                  setPasswordizeOptions((prev) => ({
                    ...prev,
                    digits: value,
                  }));
                  field.handleChange(value);
                  form.handleSubmit();
                }}
              />
            )}
          </form.Field>
          <form.Field name="spaces">
            {(field) => (
              <div className="flex items-center">
                <Switch
                  id="spaces"
                  checked={!field.state.value}
                  onChange={(value) => {
                    setPasswordizeOptions((prev) => ({
                      ...prev,
                      spaces: !value,
                    }));
                    field.handleChange(!value);
                    form.handleSubmit();
                  }}
                />
                <label
                  htmlFor="spaces"
                  className="ml-3 cursor-pointer"
                >
                  Odstranit mezery
                </label>
              </div>
            )}
          </form.Field>
          <form.Field name="diacritics">
            {(field) => (
              <div className="flex items-center">
                <Switch
                  id="diacritics"
                  checked={!field.state.value}
                  onChange={(value) => {
                    setPasswordizeOptions((prev) => ({
                      ...prev,
                      diacritics: !value,
                    }));
                    field.handleChange(!value);
                    form.handleSubmit();
                  }}
                />
                <label
                  htmlFor="diacritics"
                  className="ml-3 cursor-pointer"
                >
                  Odstranit diakritiku
                </label>
              </div>
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

  const longestWordLength = words.reduce((prev, curr) =>
    prev.value.length > curr.value.length ? prev : curr,
  ).value.length;

  const precalculatedEntropies: Record<string, number> = {};

  for (let wordLength = shortestWordLength; wordLength <= longestWordLength; wordLength++) {
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
      longestWordLength,
      precalculatedEntropies,
    },
  };
};
