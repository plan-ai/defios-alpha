import React from 'react';
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import cn from 'classnames';
import ButtonDrip from '@/components/ui/button/button-drip';
import ButtonLoader from '@/components/ui/button/button-loader';
import { LoaderSizeTypes, LoaderVariantTypes } from '@/components/ui/loader';

type ShapeNames = 'rounded' | 'pill' | 'circle';
type ColorNames =
  | 'GreenSolid'
  | 'GreenOutline'
  | 'PrimaryOutline'
  | 'PrimarySolid'
  | 'RedOutline'
  | 'RedSolid'
  | 'GraySolid'
  | 'GrayOutline'
  | 'YellowOutline'
  | 'YellowSolid'
  | 'WhiteOutline'
  | 'WhiteSolid';
type SizeNames = 'mini' | 'small' | 'medium' | 'large';

const shapes: Record<ShapeNames, string> = {
  rounded: 'rounded-md sm:rounded-lg',
  pill: 'rounded-full',
  circle: 'rounded-full',
};

const colorThemes: Record<ColorNames, string> = {
  PrimaryOutline: 'border-primary text-primary bg-newdark',
  GreenOutline: 'border-new-green text-new-green bg-newdark',
  RedOutline: 'border-new-red text-new-red bg-newdark',
  GrayOutline: 'border-gray-600 text-gray-600 bg-newdark',
  YellowOutline: 'border-yellow-500 text-yellow-500 bg-newdark',
  WhiteOutline: 'border-white text-white bg-newdark',
  PrimarySolid: 'border-newdark text-newdark bg-primary',
  GreenSolid: 'border-newdark text-newdark bg-new-green',
  RedSolid: 'border-newdark text-newdark bg-new-red',
  GraySolid: 'border-newdark text-newdark bg-gray-600',
  YellowSolid: 'border-newdark text-newdark bg-yellow-500',
  WhiteSolid: 'border-newdark text-newdark bg-white',
};

const sizes: Record<SizeNames, string> = {
  mini: 'py-0.5 px-4 border text-xs xl:text-sm 3xl:text-base',
  small: 'py-1 px-4 border text-xs xl:text-sm 3xl:text-base',
  medium: 'py-2 px-8 border-2 text-sm xl:text-base 3xl:text-lg',
  large: 'py-3 px-8 border-2 text-sm xl:text-base 3xl:text-lg',
};

interface ButtonNewProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  disabled?: boolean;
  shape?: ShapeNames;
  color?: ColorNames;
  size?: SizeNames;
  fullWidth?: boolean;
  loaderSize?: LoaderSizeTypes;
  loaderVariant?: LoaderVariantTypes;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const ButtonNew = forwardRef<HTMLButtonElement, ButtonNewProps>(
  (
    {
      children,
      className,
      isLoading,
      disabled,
      fullWidth,
      shape = 'pill',
      color = 'PrimaryOutline',
      size = 'medium',
      loaderSize = 'small',
      loaderVariant = 'scaleUp',
      onClick,
      ...buttonProps
    },
    ref: React.Ref<HTMLButtonElement | null>
  ) => {
    let [dripShow, setDripShow] = useState<boolean>(false);
    let [dripX, setDripX] = useState<number>(0);
    let [dripY, setDripY] = useState<number>(0);
    const colorClassNames = colorThemes[color];
    const buttonRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => buttonRef.current);
    function dripCompletedHandle() {
      setDripShow(false);
      setDripX(0);
      setDripY(0);
    }
    const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isLoading && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDripShow(true);
        setDripX(event.clientX - rect.left);
        setDripY(event.clientY - rect.top);
      }
      onClick && onClick(event);
    };

    let buttonDripColor = 'rgba(255, 255, 255, 0.3)';

    return (
      <button
        ref={buttonRef}
        onClick={clickHandler}
        className={cn(
          'relative overflow-hidden whitespace-pre font-semibold transition-all',
          !disabled
            ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus:-translate-y-0.5 focus:shadow-md'
            : 'cursor-not-allowed',
          colorClassNames,
          fullWidth ? 'w-full' : 'w-fit',
          shapes[shape],
          sizes[size],
          className
        )}
        disabled={disabled}
        {...buttonProps}
      >
        <span
          className={cn(
            'flex items-center justify-center gap-2',
            isLoading && 'invisible opacity-0'
          )}
        >
          {children}
        </span>

        {isLoading && (
          <ButtonLoader size={loaderSize} variant={loaderVariant} />
        )}

        {dripShow && (
          <ButtonDrip
            x={dripX}
            y={dripY}
            color={
              ['white', 'gray'].indexOf(color) !== -1
                ? 'rgba(0, 0, 0, 0.1)'
                : buttonDripColor
            }
            fullWidth={fullWidth}
            onCompleted={dripCompletedHandle}
          />
        )}
      </button>
    );
  }
);

ButtonNew.displayName = 'Button';
export default ButtonNew;
