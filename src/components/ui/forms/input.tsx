import { forwardRef } from 'react';
import cn from 'classnames';
import { SearchIcon } from '@/components/icons/search';

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
  useUppercaseLabel?: boolean;
  search?: boolean;
  searchLeft?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      type = 'text',
      className,
      inputClassName,
      search,
      searchLeft,
      useUppercaseLabel = true,
      ...props
    },
    ref
  ) => (
    <div className={cn('relative text-2xs xl:text-xs 3xl:text-sm', className)}>
      <label>
        {label && (
          <span
            className={cn(
              'block text-xs font-medium tracking-widest text-gray-100 xl:text-sm 3xl:text-base',
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
            'mt-1 block !h-9 w-full rounded-md border-2 border-light-gray bg-light-gray px-4 py-2 text-sm text-gray-100 placeholder-gray-400 transition-shadow duration-200 invalid:border-red-500 invalid:text-red-600 focus:border-primary focus:outline-none focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:border-gray-700 disabled:text-gray-500 sm:rounded-lg xl:text-sm 2xl:!h-10 3xl:!h-11 3xl:text-base',
            {
              'pl-8 xl:pl-9 3xl:pl-10': search,
            },
            inputClassName
          )}
        />
        {search && (
          <SearchIcon className="absolute left-3.5 top-[35%] h-3.5 w-3.5 text-gray-500 xl:h-4 xl:w-4 3xl:h-5 3xl:w-5" />
        )}
        {searchLeft && (
          <SearchIcon className="absolute right-5 top-[35%] h-3.5 w-3.5 text-gray-500 xl:h-4 xl:w-4 3xl:h-5 3xl:w-5" />
        )}
      </label>
      {error && (
        <span
          role="alert"
          className="mt-2 block text-xs text-red-500 sm:mt-2.5 xl:text-sm 3xl:text-base"
        >
          {error}
        </span>
      )}
    </div>
  )
);

Input.displayName = 'Input';
export default Input;
