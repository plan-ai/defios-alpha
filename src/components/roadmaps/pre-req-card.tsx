import cn from 'classnames';
import { GreenCheck } from '@/components/icons/green-check';
import { YellowClock } from '@/components/icons/yellow-clock';
import { RedCross } from '@/components/icons/red-cross';
import { preRequisitesType } from '@/data/static/roadmap-list';

type PreReqCardProps = {
  item: preRequisitesType;
  className?: string;
};

export default function PreReqCard({ item, className }: PreReqCardProps) {
  const { title, name, dueDate, amountDone, amountOutOf, coin, status } = item;
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl bg-light-dark p-3 text-2xs font-medium shadow-card xl:text-xs 3xl:text-sm',
        className
      )}
    >
      <div className="flex w-[60%] items-center justify-between">
        <div className="ml-2">
          <div className="flex gap-3 text-2xs font-medium text-white xl:text-xs 3xl:text-sm">
            <div>{title}</div>
            <div className="text-gray-400">@{name}</div>
          </div>
          <div className=" text-3xs text-gray-400 xl:text-2xs 3xl:text-xs">
            Due Date -{dueDate}
          </div>
        </div>
      </div>
      <div className="flex items-center pl-2 pr-0.5">
        <div className="pr-2.5 text-2xs font-medium xl:text-xs 3xl:text-sm">
          {amountDone} {coin}/{amountOutOf} {coin}
        </div>
        <div>
          {status === 'completed' && <GreenCheck />}
          {status === 'in progress' && <YellowClock />}
          {status === 'not started' && <RedCross />}
        </div>
      </div>
    </div>
  );
}
