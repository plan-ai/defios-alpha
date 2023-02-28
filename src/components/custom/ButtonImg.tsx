import React from 'react';
import { CodeIcon } from '../icons/code';
import { BuildingIcon } from '../icons/building';
import { BankNotesIcon } from '../icons/banknotes';
import cn from 'classnames';

interface ButtonImgProps {
  label: string;
  image?: string;
  onClick?: any;
  active?: boolean;
}

export const ButtonImg: React.FC<ButtonImgProps> = ({
  label,
  image,
  onClick,
  active,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-[12px]',
        {
          'bg-blue-500': active === true,
        }
      )}
    >
      <div>
        {image === 'Developer' && <CodeIcon />}
        {image === 'Repository Owner' && <BankNotesIcon />}
        {image === 'Company' && <BuildingIcon />}
      </div>
      <div className="whitespace-nowrap">{label}</div>
    </button>
  );
};

export default ButtonImg;
