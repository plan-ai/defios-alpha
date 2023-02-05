import { StaticImageData } from 'next/image';
import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import Image from '@/components/ui/image';
import FeaturedCard from '@/components/nft/featured-card';
import ListCard from '@/components/ui/list-card';
import AnchorLink from '@/components/ui/links/anchor-link';
import { ArrowLinkIcon } from '@/components/icons/arrow-link-icon';
import { nftData } from '@/data/static/single-nft';
import NftDropDown from '@/components/nft/nft-dropdown';
import Avatar from '@/components/ui/avatar';
import NftFooter from './nft-footer';

type Avatar = {
  id: string | number;
  name: string;
  slug: string;
  logo: StaticImageData;
};
type NftDetailsProps = {
  isAuction?: boolean;
  image: StaticImageData;
  name: string;
  description: string;
  minted_date: string;
  minted_slug: string;
  price: number;
  creator: Avatar;
  collection: Avatar;
  owner: Avatar;
  block_chains: Avatar[];
};

export default function NftDetails({ product }: { product: NftDetailsProps }) {
  const {
    isAuction,
    image,
    name,
    description,
    minted_date,
    minted_slug,
    price,
    creator,
    collection,
    owner,
    block_chains,
  } = product;

  return (
    <div className="flex flex-grow">
      <div className="mx-auto flex w-full flex-grow flex-col transition-all xl:max-w-[1360px] 4xl:max-w-[1760px]">
        <div className="relative mb-5 flex flex-grow items-center justify-center md:left-0 md:pb-7 md:pt-4 md:pl-6 lg:fixed lg:mb-0 lg:h-[calc(100%-96px)] lg:w-[calc(100%-492px)] lg:pl-8 xl:w-[calc(100%-550px)] xl:pr-12 xl:pl-[340px] 2xl:pl-96 3xl:w-[calc(100%-632px)] 4xl:pl-0">
          <div className="flex h-full max-h-full w-full items-center justify-center lg:max-w-[768px]">
            <div className="relative aspect-square max-h-full overflow-hidden rounded-lg">
              <Image
                src={image}
                alt={name}
                className="h-full bg-light-dark"
              />
            </div>
          </div>
        </div>

        <div className="relative flex w-full flex-grow flex-col justify-between md:ml-auto md:pl-8 lg:min-h-[calc(100vh-96px)] lg:w-[460px] lg:pl-12 xl:w-[592px] xl:pl-20">
          <div className="block">
            <div className="block">
              <div className="flex justify-between">
                <h2 className="text-xl font-medium leading-[1.45em] -tracking-wider text-white md:text-2xl xl:text-3xl">
                  {name}
                </h2>
                <div className="mt-1.5 ml-3 shrink-0 xl:mt-2">
                  <NftDropDown />
                </div>
              </div>
              <AnchorLink
                href={minted_slug}
                className="mt-1.5 inline-flex items-center text-sm -tracking-wider text-gray-400 hover:text-white xl:mt-2.5"
              >
                Minted on {minted_date}
                <ArrowLinkIcon className="ml-2 h-3 w-3" />
              </AnchorLink>
              <div className="mt-4 flex flex-wrap gap-6 pt-0.5 lg:-mx-6 lg:mt-6 lg:gap-0">
                <div className="shrink-0 border-dashed border-gray-700 lg:border-r lg:px-6">
                  <h3 className="text-heading-style mb-2 uppercase text-white">
                    Created By
                  </h3>
                  <AnchorLink href={creator?.slug} className="inline-flex">
                    <ListCard
                      item={creator}
                      className="rounded-full p-2 text-gray-400 hover:text-white"
                    />
                  </AnchorLink>
                </div>
                <div className="shrink-0 lg:px-6">
                  <h3 className="text-heading-style mb-2.5 uppercase text-white">
                    Collection
                  </h3>
                  <AnchorLink href="#" className="inline-flex">
                    <ListCard
                      item={collection}
                      className="rounded-full p-2 text-gray-400 hover:text-white"
                    />
                  </AnchorLink>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col pb-5 xl:mt-9">
              <ParamTab
                tabMenu={[
                  {
                    title: 'Details',
                    path: 'details',
                  },
                  {
                    title: 'Bids',
                    path: 'bids',
                  },
                  {
                    title: 'History',
                    path: 'history',
                  },
                ]}
              >
                <TabPanel className="focus:outline-none">
                  <div className="space-y-6">
                    <div className="block">
                      <h3 className="text-heading-style mb-2 uppercase text-white">
                        Description
                      </h3>
                      <div className="text-sm leading-6 -tracking-wider text-gray-400">
                        {description}
                      </div>
                    </div>
                    <div className="block">
                      <h3 className="text-heading-style mb-2 uppercase text-white">
                        Owner
                      </h3>
                      <AnchorLink href={owner?.slug} className="inline-block">
                        <ListCard
                          item={owner}
                          className="rounded-full p-2 text-gray-400 hover:text-white"
                        />
                      </AnchorLink>
                    </div>
                    <div className="block">
                      <h3 className="text-heading-style mb-2 uppercase text-white">
                        Block Chain
                      </h3>
                      <div className="flex flex-col gap-2">
                        {block_chains?.map((item: any) => (
                          <AnchorLink
                            href="#"
                            className="inline-flex"
                            key={item?.id}
                          >
                            <ListCard
                              item={item}
                              className="rounded-full p-2 text-gray-400 hover:text-white"
                            />
                          </AnchorLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel className="focus:outline-none">
                  <div className="flex flex-col-reverse">
                    {nftData?.bids?.map((bid) => (
                      <FeaturedCard
                        item={bid}
                        key={bid?.id}
                        className="mb-3 first:mb-0"
                      />
                    ))}
                  </div>
                </TabPanel>
                <TabPanel className="focus:outline-none">
                  <div className="flex flex-col-reverse">
                    {nftData?.history?.map((item) => (
                      <FeaturedCard
                        item={item}
                        key={item?.id}
                        className="mb-3 first:mb-0"
                      />
                    ))}
                  </div>
                </TabPanel>
              </ParamTab>
            </div>
          </div>
          <NftFooter
            className="hidden md:block"
            currentBid={nftData?.bids[nftData?.bids?.length - 1]}
            auctionTime={Date.now() + 4000000 * 10}
            isAuction={isAuction}
            price={price}
          />
        </div>
        <NftFooter
          currentBid={nftData?.bids[nftData?.bids?.length - 1]}
          auctionTime={Date.now() + 4000000 * 10}
          isAuction={isAuction}
          price={price}
        />
      </div>
    </div>
  );
}
