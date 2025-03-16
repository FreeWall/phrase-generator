import getConfig from 'next/config';
import { FaGithub } from 'react-icons/fa';
import Link from '@/components/ui/link';

const { publicRuntimeConfig } = getConfig();

interface LayoutProps extends React.PropsWithChildren {}

export default function Layout(props: LayoutProps) {
  return (
    <div className="flex min-h-full w-full flex-col">
      <div className="sticky top-0 z-40 flex items-center justify-between bg-white px-4 py-2 shadow dark:shadow-none">
        <div className="flex items-center gap-4 px-2">
          <div className="text-lg font-medium">Phrase generator</div>
        </div>
        <div
          className="flex items-center gap-0"
          suppressHydrationWarning
        >
          <Link
            href={publicRuntimeConfig?.repository}
            target="_blank"
            className="cursor-pointer select-none rounded-full p-3.5 hover:bg-[#f4f4f4]"
          >
            <FaGithub className="h-5 w-5" />
          </Link>
        </div>
      </div>
      <div className="flex-1 p-10">{props.children}</div>
    </div>
  );
}
