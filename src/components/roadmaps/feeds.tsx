import cn from 'classnames';
import { RoadmapList } from '@/data/static/roadmap-list';
import RoadmapCard from '@/components/roadmaps/roadmap-card';
import { useGridSwitcher } from '@/lib/hooks/use-grid-switcher';

export default function Feeds({ className }: { className?: string }) {
  const { isGridCompact } = useGridSwitcher();
  return (
    <div
      className={cn(
        'grid gap-5 sm:grid-cols-2 md:grid-cols-3',
        isGridCompact
          ? '3xl:!grid-cols-4 4xl:!grid-cols-5'
          : '3xl:!grid-cols-3 4xl:!grid-cols-4',
        className
      )}
    >
      {RoadmapList.map((item, idx) => (
        <RoadmapCard
          key={idx}
          name={item.name}
          image={item.image}
          creator={item.creator}
          creatorImage={item.creatorImage}
          totalStake={item.totalStake}
          creationDate={item.creationDate}
          details={item.details}
          deliverable={item.deliverable}
          status={item.status}
        />
      ))}
    </div>
  );
}
