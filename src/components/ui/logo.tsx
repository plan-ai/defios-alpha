import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import darkLogo from '@/assets/images/logo-full.png';
import routes from '@/config/routes';

export default function Logo() {
  const isMounted = useIsMounted();
  return (
    <div className="flex w-28 outline-none 2xl:w-32">
      <span className="relative flex overflow-hidden">
        {isMounted && <Image src={darkLogo} alt="DefiOS" priority />}
      </span>
    </div>
  );
}
