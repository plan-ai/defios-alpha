import cn from 'classnames';
import Header from '@/layouts/header/header';
import Sidebar from '@/layouts/sidebar/_default';

export default function ModernLayout({
  children,
  contentClassName,
}: React.PropsWithChildren<{ contentClassName?: string }>) {
  return (
    <div className="lg:pl-56 xl:pl-64 2xl:pl-72 3xl:pl-80">
      <Header />
      <Sidebar className="hidden lg:flex" />
      <main className={cn('px-6 pt-4 pb-5 ', contentClassName)}>
        {children}
      </main>
    </div>
  );
}
