import cn from 'classnames';
import { RoadmapList } from '@/data/static/roadmap-list';
import RoadmapCard from '@/components/roadmaps/roadmap-card';
import { useGridSwitcher } from '@/lib/hooks/use-grid-switcher';
import ErrorDarkImage from '@/assets/images/404-dark.svg';
import Image from 'next/image';
import Spinner from '@/components/custom/spinner';

export default function Feeds({
  className,
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
  className?: string;
}) {
  const { isGridCompact } = useGridSwitcher();
  return (
    <>
      {!isLoading && data.length !== 0 && (
        <div
          className={cn(
            'grid gap-5 sm:grid-cols-2 md:grid-cols-3',
            isGridCompact
              ? '3xl:!grid-cols-4 4xl:!grid-cols-5'
              : '3xl:!grid-cols-3 4xl:!grid-cols-4',
            className
          )}
        >
          {data.length !== 0 &&
            data.map((item: any, idx: number) => (
              <RoadmapCard key={idx} item={item} />
            ))}
        </div>
      )}
      {!isLoading && data.length === 0 && (
        <div className="mt-16 flex w-full flex-col items-center justify-center gap-5">
          <Image src={ErrorDarkImage} className="w-80" alt="404 Error" />
          <div className="text-lg text-gray-500">
            No roadmaps found that match your filter and search settings
          </div>
        </div>
      )}
      {isLoading && (
        <div className="mt-20 flex w-full items-center justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
}
