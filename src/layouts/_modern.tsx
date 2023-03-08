import cn from 'classnames';
import Header from '@/layouts/header/header';
import Sidebar from '@/layouts/sidebar/_default';

export default function ModernLayout({
  children,
  contentClassName,
}: React.PropsWithChildren<{ contentClassName?: string }>) {
  return (
    <div className="xl:pl-72 2xl:pl-80">
      <Header />
      <Sidebar className="hidden xl:block" />
      <main
        className={cn(
          'pt-4 pb-5 px-6 ',
          contentClassName
        )}
      >
        {children}
      </main>
    </div>
  );
}
