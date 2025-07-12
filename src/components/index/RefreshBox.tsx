import { MouseEventHandler, PropsWithChildren, useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';

import { cn, vibrate } from '@/utils/utils';

interface RefreshBoxProps extends PropsWithChildren {
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onButtonClick?: () => void;
}

export default function RefreshBox(props: RefreshBoxProps) {
  const [rotation, setRotation] = useState(0);

  function handleButtonClick() {
    setRotation(rotation + 180);
    vibrate(1);
    props.onButtonClick?.();
  }

  return (
    <div
      className={cn(
        'bg-darker relative flex justify-between rounded-lg py-4 pr-4 pl-5 text-xl md:pl-9 md:text-2xl',
        {
          'bg-loader': props.loading,
        },
      )}
      onClick={props.onClick}
    >
      {props.children}
      {props.onButtonClick && (
        <div className="absolute -top-14 -right-4 sm:relative sm:top-0 sm:right-0">
          <button
            className="text-highlight cursor-pointer rounded-full px-5 py-4 outline-none select-none hover:brightness-75 sm:px-4 sm:py-5"
            onClick={handleButtonClick}
            type="button"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.3s cubic-bezier(0.3, 1, 0.5, 1)',
            }}
          >
            <FaSyncAlt className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        </div>
      )}
    </div>
  );
}
