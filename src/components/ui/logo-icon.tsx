import Image from '@/components/ui/image';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import darkLogo from '@/assets/images/logo-icon-white.png';

const Logo: React.FC<React.SVGAttributes<{}>> = (props) => {
  const isMounted = useIsMounted();

  return (
    <div className="flex cursor-pointer outline-none" {...props}>
      <span className="relative flex overflow-hidden">
        {isMounted && <Image src={darkLogo} alt="Criptic" priority />}
      </span>
    </div>
  );
};

export default Logo;
