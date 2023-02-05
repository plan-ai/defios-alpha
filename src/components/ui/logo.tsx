import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import darkLogo from '@/assets/images/logo-white.svg';
import routes from '@/config/routes';

export default function Logo() {
  const isMounted = useIsMounted();
  return (
    <AnchorLink
      href={{
        pathname: routes.home,
      }}
      className="flex w-28 outline-none sm:w-32 4xl:w-36"
    >
      <span className="relative flex overflow-hidden">
        {isMounted && <Image src={darkLogo} alt="Criptic" priority />}
      </span>
    </AnchorLink>
  );
}
