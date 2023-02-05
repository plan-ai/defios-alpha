import cn from 'classnames';
import { Switch } from '@/components/ui/switch';

interface ToggleBarProps {
  title: string;
  subTitle?: string;
  icon?: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}

function ToggleBar({
  title,
  subTitle,
  icon,
  checked,
  onChange,
  children,
}: React.PropsWithChildren<ToggleBarProps>) {
  return (
    <div className="rounded-lg shadow-card bg-light-dark">
      <div className="relative flex items-center justify-between gap-4 p-4">
        <div className="mr-6 flex items-center">
          {icon && (
            <div className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-600 text-gray-400">
              {icon}
            </div>
          )}
          <div>
            <span className="block text-xs font-medium uppercase tracking-wider text-white sm:text-sm">
              {title}
            </span>
            {subTitle && (
              <span className="mt-1 hidden text-xs tracking-tighter text-gray-400 sm:block">
                {subTitle}
              </span>
            )}
          </div>
        </div>

        <Switch checked={checked} onChange={onChange}>
          <div
            className={cn(
              checked
                ? 'bg-white'
                : 'bg-gray-700',
              'relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-300'
            )}
          >
            <span
              className={cn(
                checked
                  ? 'translate-x-5 bg-gray-700'
                  : 'translate-x-0.5 bg-gray-400',
                'inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-200'
              )}
            />
          </div>
        </Switch>
      </div>

      {children && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default ToggleBar;
