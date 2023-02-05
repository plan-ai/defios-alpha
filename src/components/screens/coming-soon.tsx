import React from 'react';
import cn from 'classnames';
import Input from '@/components/ui/forms/input';
import Button from '../ui/button/button';

interface ComingSoonProps {
  header: string;
  discription: string;
  videoLink: string;
  inputPrompt: string;
  submitPrompt: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  header,
  discription,
  videoLink,
  inputPrompt,
  submitPrompt,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-5 text-4xl">{header}</div>
        <div className="w-[80%] text-center text-lg">{discription}</div>
      </div>
      <div className="m-5 h-[28rem] w-[50rem] bg-body">
        <iframe
          width="100%"
          height="100%"
          src={videoLink}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
      <div className="flex w-full items-center justify-center">
        <Input className="w-[65%]" type="email" placeholder={inputPrompt} />
        <Button shape="rounded">{submitPrompt}</Button>
      </div>
    </div>
  );
};

export default ComingSoon;
