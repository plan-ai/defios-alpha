import cn from 'classnames';
import { RoadmapList } from '@/data/static/roadmap-list';
import RoadmapCard from '@/components/ui/roadmap-card';
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
      {RoadmapList.map((nft) => (
        <RoadmapCard
          key={nft.id}
          name={nft.name}
          image={nft.image}
          creator={nft.creator}
          creatorImage={nft.creatorImage}
          totalStake={nft.totalStake}
          creationDate={nft.creationDate}
        />
      ))}
    </div>
  );
}
