import ReactSlider from 'rc-slider';
import { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  step?: number;
  disabled?: boolean;
  label?: ReactNode;
  className?: string;
  onChange?: (value: number) => void;
}

export default function Slider(props: SliderProps) {
  return (
    <div className={cn('', props.className)}>
      {props.label && <div className="mb-3">{props.label}</div>}
      <div className="pr-4">
        <ReactSlider
          min={props.min}
          max={props.max}
          step={props.step}
          value={props.value}
          disabled={props.disabled}
          className="relative h-2 w-full touch-none select-none"
          classNames={{
            handle: cn(
              'absolute bg-text rounded-full w-5 h-5 -mt-1.5 cursor-grab ml-2 outline-none',
              { 'bg-border cursor-default': props.disabled },
            ),
            track: cn('absolute h-2 bg-text rounded-full pr-2 box-content', {
              'bg-border': props.disabled,
            }),
            rail: /** @tw */ 'absolute w-full h-2 bg-darker rounded-full box-content pr-4',
          }}
          onChange={(value) => props.onChange?.(value as number)}
          styles={{
            track: {},
          }}
          activeDotStyle={{
            border: 'none',
          }}
        />
      </div>
    </div>
  );
}
