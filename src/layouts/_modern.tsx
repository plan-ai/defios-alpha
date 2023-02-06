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
          ' px-4 pt-4 pb-12 sm:px-6 sm:pb-12 lg:px-8 xl:pb-16 3xl:px-10 3xl:pt-0.5',
          contentClassName
        )}
      >
        {children}
      </main>
    </div>
  );
}
