import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

interface LayoutProps extends React.PropsWithChildren {}

export default function Layout(props: LayoutProps) {
  return (
    <div className="flex min-h-full w-full flex-col items-center p-20">
      {/* <div className="sticky top-0 z-40 flex items-center justify-between bg-white px-4 py-2 shadow-sm dark:shadow-none">
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
            className="cursor-pointer rounded-full p-3.5 select-none hover:bg-[#f4f4f4]"
          >
            <FaGithub className="h-5 w-5" />
          </Link>
        </div>
      </div> */}
      <div className="w-full max-w-[800px]">
        <div className="mb-14">
          <div className="text-3xl font-semibold">Generátor frázového hesla</div>
          <div className="pt-1">
            Vytvořte si silné frázové heslo, které je snadno zapamatovatelné
          </div>
        </div>
        {props.children}
      </div>
    </div>
  );
}
