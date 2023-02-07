import ContributionsHistoryCard from '@/components/contributions/contributions-history-card';
// static data
import { contributionsHistory } from '@/data/static/contributions';

export default function ContributionsHistory() {
  return (
    <div className="block">
      <div className="space-y-4 md:space-y-5 xl:space-y-6">
        {contributionsHistory?.map((item) => (
          <ContributionsHistoryCard item={item} key={item?.id} />
        ))}
      </div>
    </div>
  );
}
