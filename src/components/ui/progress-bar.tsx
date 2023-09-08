import { motion } from 'framer-motion';
interface ProgressBarProps {
  title?: string;
  completed?: {
    value: number;
    percentage: number;
  };
  remaining?: {
    value: number;
    percentage: number;
  };
}

export default function ProgressBar({
  title,
  completed,
  remaining,
}: ProgressBarProps) {
  return (
    <motion.div layout className="mb-2">
      <h4 className="mb-3 text-base text-gray-100 xl:text-lg 3xl:text-xl">
        {title}
      </h4>
      <div className="flex items-center gap-3">
        <div className="text-xs xl:text-sm 3xl:text-base">
          {completed?.percentage}%
        </div>
        <div className="flex h-2 w-full items-center overflow-hidden rounded-full border border-primary">
          <div
            className="progressGradient h-full"
            style={{ width: `${completed?.percentage}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
}
