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
          className="h-6 w-6 xl:h-7 xl:w-7 3xl:h-8 3xl:w-8"
        />
      )}
      <div
        className={cn('text-2xs uppercase xl:text-xs 3xl:text-sm', {
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
