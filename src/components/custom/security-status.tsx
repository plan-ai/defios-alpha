import React from 'react';
import Image from '@/components/ui/image';
import cn from 'classnames';
import SecureLogo from '@/assets/images/secure.svg';
import VulnerableLogo from '@/assets/images/vulnerable.svg';
import BrokenLogo from '@/assets/images/broken.svg';

interface SecurityStatusProps {
  security: string;
  noIcon?: boolean;
}

const SecurityStatus: React.FC<SecurityStatusProps> = ({
  security,
  noIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {(noIcon === undefined || noIcon === false) && (
        <Image
          src={
            security?.toLowerCase() === 'secure'
              ? SecureLogo
              : security?.toLowerCase() === 'vulnerable'
              ? VulnerableLogo
              : BrokenLogo
          }
          alt={security}
          className="h-8 w-8"
        />
      )}
      <div
        className={cn('text-sm uppercase', {
          'text-green-600': security?.toLowerCase() === 'secure',
          'text-yellow-500': security?.toLowerCase() === 'vulnerable',
          'text-red-600': security?.toLowerCase() === 'broken',
        })}
      >
        {security}
      </div>
    </div>
  );
};

export default SecurityStatus;
