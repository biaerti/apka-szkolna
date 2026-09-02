import { SelectHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={clsx(
        'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900',
        'focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500',
        'disabled:bg-gray-100 disabled:text-gray-400',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';
