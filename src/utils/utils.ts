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
