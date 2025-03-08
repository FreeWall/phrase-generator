import getConfig from 'next/config';
import { FaGithub, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { Theme } from '@/pages/_app';
import { cn } from '@/utils/utils';
import { useHydrated } from '@/utils/useHydrated';
import Link from '@/components/ui/link';

const { publicRuntimeConfig } = getConfig();

interface LayoutProps extends React.PropsWithChildren {}

const className =
  'cursor-pointer select-none rounded-full p-3.5 hover:bg-[#f4f4f4] dark:hover:bg-lighter';

const ThemeToggle = function ThemeToggle({
  theme,
  onChange,
}: {
  theme: Theme | undefined;
  onChange: (theme: Theme) => void;
}) {
  const isHydrated = useHydrated();
  if (!isHydrated) {
    return null;
  }

  return (
    <div
      className={className}
      onClick={() => {
        onChange(theme === 'dark' ? 'light' : 'dark');
      }}
    >
      <FaSun className={cn('h-5 w-5', { hidden: theme === 'light' })} />
      <FaMoon className={cn('h-5 w-5', { hidden: theme === 'dark' })} />
    </div>
  );
};

export default function Layout(props: LayoutProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex min-h-full w-full flex-col">
      <div className="sticky top-0 z-40 flex items-center justify-between bg-white px-4 py-2 shadow dark:bg-darker dark:shadow-none">
        <div className="flex items-center gap-4 px-2">
          <div className="text-lg font-medium">Phrase generator</div>
        </div>
        <div
          className="flex items-center gap-0"
          suppressHydrationWarning
        >
          <ThemeToggle
            theme={resolvedTheme as Theme | undefined}
            onChange={(theme) => setTheme(theme)}
          />
          <Link
            href={publicRuntimeConfig?.repository}
            target="_blank"
            className={className}
          >
            <FaGithub className="h-5 w-5" />
          </Link>
        </div>
      </div>
      <div className="flex-1 p-10">{props.children}</div>
    </div>
  );
}
