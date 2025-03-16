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
          'relative flex items-center rounded-full p-3.5 px-5 text-sm font-bold text-white uppercase transition-[padding] duration-300 select-none',
          {
            'bg-highlight hover:bg-highlight hover:brightness-90 active:brightness-75':
              color == 'main',
            'bg-red-500 hover:bg-red-600': color == 'red',
            'pointer-events-none pr-12': loading,
            'bg-highlight brightness-90': loading && color == 'main',
            'bg-red-500 brightness-90': loading && color == 'red',
            'bg-highlight pointer-events-none contrast-50': disabled,
          },
          className,
        )}
        ref={ref}
        {...rest}
      >
        {children}
        <CgSpinner
          className={cn(
            'text-body absolute right-4 animate-spin transition-[opacity] duration-300',
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
