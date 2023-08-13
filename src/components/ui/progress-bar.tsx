import { motion } from 'framer-motion';

interface ProgressBarProps {
  title: string;
  completed?: {
    value: number;
    percentage: number;
  };
  remaining?: {
    value: number;
    percentage: number;
  };
  item?: string;
  type?: string;
}

export default function ProgressBar({
  title,
  completed,
  remaining,
  item,
  type,
}: ProgressBarProps) {
  return (
    <motion.div layout className="mb-2">
      <h4 className="mb-3 text-base text-gray-100 xl:text-lg 3xl:text-xl">
        {title}
      </h4>
      <div className="flex items-center gap-5">
        <svg width="100%" height="8">
          <rect x="0" y="0" width="100%" height="8" fill="#FA606A" />
          <rect
            x="0"
            y="0"
            height="8"
            fill="#28D294"
            width={`${completed?.percentage}%`}
          />
        </svg>
        {completed !== undefined &&
          remaining !== undefined &&
          type === 'issues' && (
            <div className="flex items-start justify-end whitespace-nowrap text-xs xl:text-sm 3xl:text-base">
              <div>
                {remaining?.value + '/' + (completed?.value + remaining?.value)}{' '}
                {item} remaining
              </div>
            </div>
          )}
        {completed !== undefined &&
          remaining !== undefined &&
          type === 'voting' && (
            <div className="flex items-start justify-end whitespace-nowrap text-xs xl:text-sm 3xl:text-base">
              <div>Voting {completed.percentage}% complete</div>
            </div>
          )}
      </div>
    </motion.div>
  );
}
