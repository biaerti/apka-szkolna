import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900',
        'placeholder:text-gray-400',
        'focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500',
        'disabled:bg-gray-100 disabled:text-gray-400',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
