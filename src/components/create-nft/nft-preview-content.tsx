import React from 'react';
import Image from '@/components/ui/image';
import AuthorImage from '@/assets/images/author.jpg';
import NFT1 from '@/assets/images/nft/nft-1.jpg';
import Avatar from '@/components/ui/avatar';

export default function PreviewContent() {
  return (
    <div className="w-full xs:w-96">
      <div className="relative flex flex-grow flex-col overflow-hidden rounded-lg bg-light-dark shadow-card transition-all duration-200 hover:shadow-large">
        <div className="flex items-center p-4 text-sm font-medium text-gray-400 transition hover:text-gray-900">
          <Avatar
            size="sm"
            image={AuthorImage}
            alt="Cameronwilliamson"
            className="mr-3 border-white bg-gray-400"
          />
          @Cameronwilliamson
        </div>
        <div className="relative block w-full pb-full">
          <Image
            src={NFT1}
            placeholder="blur"
            layout="fill"
            objectFit="cover"
            alt="Pulses of Imagination #214"
          />
        </div>
        <div className="p-5">
          <div className="text-sm font-medium text-white">
            Pulses Of Imagination #214
          </div>
          <div className="mt-4 text-lg font-medium text-white">0.40 ETH</div>
        </div>
      </div>
    </div>
  );
}
