import Button from '@/components/ui/button';
import TransactionHistoryCard from '@/components/author/transaction-history-card';
// static data
import { transactionHistory } from '@/data/static/author-profile';

export default function TransactionHistory() {
  return (
    <div className="block">
      <div className="space-y-4 md:space-y-5 xl:space-y-6">
        {transactionHistory?.map((item) => (
          <TransactionHistoryCard item={item} key={item?.id} />
        ))}
      </div>
    </div>
  );
}
