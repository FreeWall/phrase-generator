import ReactSlider from 'rc-slider';

interface SliderProps {}

export default function Slider(props: SliderProps) {
  return (
    <ReactSlider
      min={2}
      max={5}
      step={1}
      dots
      className="relative w-full touch-none select-none"
      classNames={{
        handle:
          /** @tw */ 'absolute bg-text rounded-full w-5 h-5 -mt-1.5 cursor-grab',
        track: /** @tw */ 'absolute h-2 bg-text rounded-full',
        rail: /** @tw */ 'absolute w-full h-2 bg-darker rounded-full',
      }}
      onChange={(values) => {}}
      onChangeComplete={(values) => {}}
      styles={{
        track: {},
      }}
      activeDotStyle={{
        border: 'none',
      }}
    />
  );
}
