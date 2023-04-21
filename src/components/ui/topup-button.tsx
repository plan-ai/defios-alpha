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
        'flex h-10 w-full items-center whitespace-nowrap rounded-xl border-2 border-dashed border-gray-600 bg-gray-800 px-6 text-sm uppercase tracking-wider text-white lg:h-12 3xl:h-13',
        className
      )}
    >
      <span
        className={cn(
          'mr-3.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white lg:h-6 lg:w-6',
          symbolClass
        )}
      >
        <Plus className="h-auto w-2.5 lg:w-auto" />
      </span>
      <span className="mr-3.5 flex-grow text-justify text-xs lg:text-sm">
        {label}
      </span>
    </button>
  );
}
