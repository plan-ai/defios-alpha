import { ArrowUp } from '@/components/icons/arrow-up';
import AnchorLink from '@/components/ui/links/anchor-link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import cn from 'classnames';
import Image from 'next/image';
import PriceChart from '@/components/ui/chats/price-chart';
import { useEffect, useState } from 'react';
import axios from 'axios';

type TopTokenFeedProps = {
  data: any;
};

export function TopTokenFeed({ data }: TopTokenFeedProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [tokenImgUrl, setTokenImgUrl] = useState('');

  useEffect(() => {
    const _url = data?.token_image_url;
    if (_url.includes('gateway.pinata.cloud')) {
      const IpfsNewGateway = _url.replace('gateway.pinata.cloud', 'ipfs.io');
      axios
        .get(IpfsNewGateway)
        .then((res) => {
          if (typeof res.data === 'object') {
            if (res.data.image) {
              setTokenImgUrl(res.data.image);
            } else {
              setTokenImgUrl(data?.token_image_url);
            }
          } else {
            setTokenImgUrl(data?.token_image_url);
          }
        })
        .catch((err) => {
          console.log(err);
          setTokenImgUrl(data?.token_image_url);
        });
    }
    if (_url == '') {
      axios
        .get(
          `https://public-api.solscan.io/token/meta?tokenAddress=${data?.token_spl_addr}`,
          {
            headers: {
              token: process.env.SOLSCAN_TOKEN,
            },
          }
        )
        .then((res) => {
          if (res.data.icon) {
            setTokenImgUrl(res.data.icon);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [data]);

  useEffect(() => {
    if (typeof data?.token_price_feed === 'string') {
      axios
        .post('/api/chart', {
          data_url: data?.token_price_feed,
        })
        .then((res) => setChartData(res.data))
        .catch((err) => console.log(err.message));
    }
  }, [data]);
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl bg-light-dark p-5 pb-2 shadow-card lg:flex-row'
      )}
    >
      <div className="w-full flex-col">
        <AnchorLink
          href={`https://solscan.io/token/${data?.token_spl_addr}`}
          target="_blank"
        >
          <div className="mb-2 flex items-center">
            <Image
              src={tokenImgUrl || ''}
              alt={data?.token_symbol || ''}
              width={36}
              height={36}
              className="rounded-full"
            />
            <h4 className="ml-3 text-sm font-medium text-white">
              {data?.token_name}
            </h4>
          </div>
        </AnchorLink>

        <div className="flex items-center gap-4">
          <div className="w-full flex-col">
            <div className="mb-2 text-sm font-medium tracking-tighter text-white lg:text-lg 2xl:text-xl 3xl:text-2xl">
              1<span className="ml-3">{data?.token_symbol}</span>
            </div>

            <div className="flex items-center text-xs font-medium 2xl:text-sm">
              <span className="mr-5 truncate tracking-tighter text-gray-400 2xl:w-24 3xl:w-auto">
                $ {Math.round(data?.token_ltp * 10000) / 10000}
              </span>

              <span
                className={`flex items-center  ${
                  data?.token_ltp_24h_change >= 0
                    ? 'text-new-green'
                    : 'text-red-500'
                }`}
              >
                <span
                  className={`mr-2 ${
                    data?.token_ltp_24h_change < 0 ? 'rotate-180' : ''
                  }`}
                >
                  <ArrowUp />
                </span>
                {Math.round(Math.abs(data?.token_ltp_24h_change * 100)) / 100}%
              </span>
            </div>
          </div>
          {chartData !== null && (
            <PriceChart
              change={chartData?.change}
              chartData={chartData?.data}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface TopTokenFeedSliderProps {
  TopTokenFeeds: any;
}

export default function TopTokenFeedSlider({
  TopTokenFeeds,
}: TopTokenFeedSliderProps) {
  const isMounted = useIsMounted();

  return isMounted ? (
    <Swiper
      modules={[A11y]}
      spaceBetween={20}
      slidesPerView={2}
      observer={true}
      dir="ltr"
    >
      {TopTokenFeeds &&
        TopTokenFeeds.map((item: any, idx: number) => (
          <SwiperSlide key={idx}>
            <TopTokenFeed data={item} />
          </SwiperSlide>
        ))}
    </Swiper>
  ) : (
    <div></div>
  );
}
