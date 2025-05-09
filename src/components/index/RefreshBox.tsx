import { MouseEventHandler, PropsWithChildren, useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';

import { cn } from '@/utils/utils';

interface RefreshBoxProps extends PropsWithChildren {
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onButtonClick?: () => void;
}

export default function RefreshBox(props: RefreshBoxProps) {
  const [rotation, setRotation] = useState(0);

  function handleButtonClick() {
    setRotation(rotation + 180);
    props.onButtonClick?.();
  }

  return (
    <div
      className={cn('bg-darker flex justify-between rounded-lg py-4 pr-4 pl-9 text-2xl', {
        'bg-loader': props.loading,
      })}
      onClick={props.onClick}
    >
      {props.children}
      {props.onButtonClick && (
        <div>
          <button
            className="text-highlight cursor-pointer rounded-full px-4 py-5 outline-none select-none hover:brightness-75"
            onClick={handleButtonClick}
            type="button"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.3s cubic-bezier(0.3, 1, 0.5, 1)',
            }}
          >
            <FaSyncAlt className="h-7 w-7" />
          </button>
        </div>
      )}
    </div>
  );
}
