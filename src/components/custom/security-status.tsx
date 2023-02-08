import React from 'react';
import Image from '@/components/ui/image';
import cn from 'classnames';
import SecureLogo from '@/assets/images/secure.svg';
import VulnerableLogo from '@/assets/images/vulnerable.svg';
import BrokenLogo from '@/assets/images/broken.svg';

interface SecurityStatusProps {
  security: string;
}

const SecurityStatus: React.FC<SecurityStatusProps> = ({ security }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src={
          security === 'secure'
            ? SecureLogo
            : security === 'vulnerable'
            ? VulnerableLogo
            : BrokenLogo
        }
        alt={security}
        className="h-8 w-8"
      />
      <div
        className={cn('text-sm uppercase', {
          'text-green-600': security === 'secure',
          'text-yellow-500': security === 'vulnerable',
          'text-red-600': security === 'broken',
        })}
      >
        {security}
      </div>
    </div>
  );
};

export default SecurityStatus;
