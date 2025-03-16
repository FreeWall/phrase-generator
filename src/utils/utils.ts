import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function promiseAllSequence<ElementType, PromisedReturnType>(
  items: ElementType[] | undefined,
  func: (item: ElementType) => Promise<PromisedReturnType>,
): Promise<PromisedReturnType[] | undefined> {
  return items?.reduce(
    (promiseChain, item) =>
      promiseChain.then((resultsSoFar) =>
        func(item).then((currentResult) => [...resultsSoFar, currentResult]),
      ),
    Promise.resolve<PromisedReturnType[]>([]),
  );
}

export function getRandomNumber(min: number, max: number): number {
  const range = max - min + 1;

  const byteCount = range > 256 ? Math.ceil(Math.log2(range) / 8) : 1;
  const byteArray = window.crypto.getRandomValues(new Uint8Array(byteCount));
  let randomValue = 0;
  for (let i = 0; i < byteCount; i++) {
    randomValue = randomValue * 256 + byteArray[i]!;
  }
  return (randomValue % range) + min;
}

export function getRandomBoolean(): boolean {
  return !!getRandomNumber(0, 1);
}
