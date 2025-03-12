import { clsx, type ClassValue } from 'clsx';
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
  const byteArray = window.crypto.getRandomValues(new Uint8Array(1));
  return Math.floor((byteArray[0]! / 256) * (max + 1 - min)) + min;
}

export function getRandomBoolean(): boolean {
  return !!getRandomNumber(0, 1);
}
