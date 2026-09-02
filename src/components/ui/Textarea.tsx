import { TextareaHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
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

Textarea.displayName = 'Textarea';
