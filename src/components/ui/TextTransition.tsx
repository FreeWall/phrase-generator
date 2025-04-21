import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';

export interface TextTransitionProps {
  value: string;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down';
  inline?: boolean;
  style?: CSSProperties;
  translateValue?: string;
}

export function TextTransition(props: PropsWithChildren<TextTransitionProps>) {
  const { direction = 'up', style, translateValue: tv = '0%', children, value } = props;

  const initialRun = useRef(true);
  const fromTransform = direction === 'down' ? `-${tv}` : tv;
  const leaveTransform = direction === 'down' ? tv : `-${tv}`;

  const [width, setWidth] = useState<number>(0);
  const currentRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<number | string>('auto');

  useEffect(() => {
    initialRun.current = false;
    const element = currentRef.current;

    if (!element) return;

    const { width, height } = element.getBoundingClientRect();
    setWidth(width);
    heightRef.current = height;
  }, [children, setWidth, currentRef]);

  return (
    <motion.div
      className="inline-flex whitespace-nowrap"
      style={{
        ...(!initialRun.current ? { width: `${width}px`, transition: `width 0.15s` } : undefined),
        ...style,
        height: heightRef.current,
      }}
    >
      <AnimatePresence>
        <motion.div
          key={value}
          initial={{
            opacity: 0,
            transform: `translateY(${fromTransform})`,
          }}
          animate={{
            opacity: 1,
            transform: 'translateY(0%)',
          }}
          exit={{
            opacity: 0,
            transform: `translateY(${leaveTransform})`,
            position: 'absolute',
          }}
          transition={{ duration: 0.15 }}
          ref={currentRef}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
