import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { Verified } from '@/components/icons/verified';
import Avatar from '@/components/ui/avatar';
import { StaticImageData } from 'next/image';

type NFTGridProps = {
  author: string;
  authorImage: StaticImageData;
  image: StaticImageData;
  name: string;
  collection: string;
  price: string;
};

export default function NFTGrid({
  author,
  authorImage,
  image,
  name,
  collection,
  price,
}: NFTGridProps) {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-card transition-all duration-200 hover:shadow-large bg-light-dark">
      <div className="p-4">
        <AnchorLink
          href="/"
          className="flex items-center text-sm font-medium transition text-gray-300 hover:text-white"
        >
          <Avatar
            image={authorImage}
            alt={name}
            size="sm"
            className="mr-3 text-ellipsis border-gray-500"
          />
          <span className="overflow-hidden text-ellipsis">@{author}</span>
        </AnchorLink>
      </div>
      <AnchorLink href="/nft-details" className="relative block w-full pb-full">
        <Image
          src={image}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
          alt=""
        />
      </AnchorLink>

      <div className="p-5">
        <AnchorLink
          href="/nft-details"
          className="text-sm font-medium text-white"
        >
          {name}
        </AnchorLink>
        <div className="mt-1.5 flex">
          <AnchorLink
            href="/"
            className="inline-flex items-center text-xs text-gray-400"
          >
            {collection}
            <Verified className="ml-1" />
          </AnchorLink>
        </div>
        <div className="mt-4 text-lg font-medium text-white">
          {price}
        </div>
      </div>
    </div>
  );
}
