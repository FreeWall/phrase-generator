import getConfig from 'next/config';
import { FaGithub } from 'react-icons/fa';

const { publicRuntimeConfig } = getConfig();

interface LayoutProps extends React.PropsWithChildren {}

export default function Layout(props: LayoutProps) {
  return (
    <div className="flex min-h-full w-full flex-col items-center p-6 pt-8 sm:p-10 md:p-20">
      <div className="absolute top-0 right-0">
        <a
          className="hidden p-6 md:inline-block"
          href={publicRuntimeConfig?.repository}
          target="_blank"
        >
          <FaGithub className="h-7 w-7" />
        </a>
      </div>
      <div className="w-full max-w-[800px]">
        <div className="mb-8 sm:mb-14">
          <div className="text-2xl font-semibold sm:text-3xl">Generátor frázového hesla</div>
          <div className="pt-4 sm:pt-1">
            Vytvořte si silné frázové heslo,
            <br className="sm:hidden" /> které je snadno zapamatovatelné
          </div>
        </div>
        {props.children}
      </div>
    </div>
  );
}
