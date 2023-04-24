import cn from 'classnames';
import { Plus } from '@/components/icons/plus';

export default function TopupButton({
  className,
  symbolClass,
  label,
}: React.PropsWithChildren<{
  className?: string;
  symbolClass?: string;
  label: string;
}>) {
  return (
    <button
      className={cn(
        'flex h-10 w-full items-center whitespace-nowrap rounded-xl border-2 border-dashed border-gray-600 bg-gray-800 px-4 text-sm uppercase tracking-wider text-white lg:h-12 4xl:h-13',
        className
      )}
    >
      <span
        className={cn(
          'xl:h-4.5 xl:w-4.5 mr-2 hidden h-4 w-4 flex-grow-0 items-center justify-center rounded-full bg-gray-900 text-white xl:flex 3xl:h-5 3xl:w-5',
          symbolClass
        )}
      >
        <Plus className="h-auto w-1.5 2xl:w-2 3xl:w-2.5" />
      </span>
      <span className="flex flex-grow items-center justify-center text-center text-justify text-2xs 2xl:text-xs 3xl:text-sm">
        {label}
      </span>
    </button>
  );
}
