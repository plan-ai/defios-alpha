import { forwardRef } from 'react';
import cn from 'classnames';

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
  useUppercaseLabel?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      type = 'text',
      className,
      inputClassName,
      useUppercaseLabel = true,
      ...props
    },
    ref
  ) => (
    <div className={cn('text-xs sm:text-sm', className)}>
      <label>
        {label && (
          <span
            className={cn(
              'block font-medium tracking-widest text-gray-100',
              useUppercaseLabel ? 'mb-2 uppercase sm:mb-3' : 'mb-2'
            )}
          >
            {label}

            {props.required && (
              <sup className="ml-1 inline-block text-[13px] text-red-500">
                *
              </sup>
            )}
          </span>
        )}
        <input
          type={type}
          ref={ref}
          {...props}
          className={cn(
            'mt-1 block h-10 w-full rounded-md border px-4 py-2 text-sm placeholder-gray-400  transition-shadow duration-200 invalid:border-red-500 invalid:text-red-600 focus:outline-none focus:ring-1 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 border-gray-700 bg-light-dark text-gray-100 focus:border-gray-600 focus:ring-gray-600 sm:h-12 sm:rounded-lg',
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

Input.displayName = 'Input';
export default Input;
