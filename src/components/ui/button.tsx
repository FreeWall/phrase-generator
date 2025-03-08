import { cn } from '@/utils/utils';
import React, { ButtonHTMLAttributes } from 'react';
import { CgSpinner } from 'react-icons/cg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  color?: 'main' | 'red';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = 'block',
      color = 'main',
      children,
      disabled,
      loading,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        className={cn(
          'relative flex select-none items-center rounded p-3.5 px-5 text-sm font-bold uppercase text-white transition-[padding] duration-300 active:brightness-90',
          {
            'bg-conversion hover:bg-conversionHover': color == 'main',
            'bg-red-500 hover:bg-red-600': color == 'red',
            'pointer-events-none pr-12': loading,
            'bg-conversionHover brightness-90': loading && color == 'main',
            'bg-red-500 brightness-90': loading && color == 'red',
            'pointer-events-none bg-conversionHover brightness-[0.7]': disabled,
          },
          className,
        )}
        ref={ref}
        {...rest}
      >
        {children}
        <CgSpinner
          className={cn(
            'absolute right-4 animate-spin text-body transition-[opacity] duration-300',
            {
              'opacity-100': loading,
              'opacity-0': !loading,
            },
          )}
          size={22}
        />
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
