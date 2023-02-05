import { forwardRef } from 'react';
import cn from 'classnames';

type TextareaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, inputClassName, ...props }, ref) => (
    <div className={cn('text-xs sm:text-sm', className)}>
      <label>
        {label && (
          <span className="mb-2 block font-medium uppercase tracking-widest text-gray-100 sm:mb-3">
            {label}
            <sup className="ml-1 inline-block text-[13px] text-red-500">*</sup>
          </span>
        )}
        <textarea
          ref={ref}
          {...props}
          className={cn(
            'mt-1 block h-24 w-full rounded-md border px-4 py-3 text-sm placeholder-gray-400 transition-shadow duration-200  invalid:border-red-500 invalid:text-red-600 focus:outline-none focus:ring-1 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 border-gray-700 bg-light-dark text-gray-100 focus:border-gray-600 focus:ring-gray-600 sm:h-28 sm:rounded-lg',
            inputClassName
          )}
        />
      </label>
      {error && (
        <span role="alert" className="mt-2 block text-red-500 sm:mt-2.5">
          {error}
        </span>
      )}
    </div>
  )
);

Textarea.displayName = 'Textarea';
export default Textarea;
