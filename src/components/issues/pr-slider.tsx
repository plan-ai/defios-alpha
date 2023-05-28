import React, { useState, useEffect } from 'react';
import { Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { LinkIcon } from '@/components/icons/link-icon';
import AnchorLink from '@/components/ui/links/anchor-link';
import cn from 'classnames';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { fetchDecimals } from '@/lib/helpers/metadata';

interface PRChekerProps {
  title: string;
  amountStaked: number;
  ghAuthor: string;
  pubKeyAuthor: string;
  link: string;
  checked: boolean;
  tokenSymbol: string;
  tokenDecimals: number;
}

export const PRCard: React.FC<PRChekerProps> = ({
  title,
  amountStaked,
  ghAuthor,
  pubKeyAuthor,
  link,
  checked,
  tokenSymbol,
  tokenDecimals,
}) => {
  const { data: session } = useSession();

  const [githubUsername, setGithubUsername] = useState('');
  useEffect(() => {
    if (ghAuthor === '') return;
    axios
      .get(`https://api.github.com/user/${ghAuthor}`, {
        headers: {
          Authorization: `Bearer ${(session as any)?.accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      .then((res) => setGithubUsername(res.data.login))
      .catch((err) => console.log(err));
  }, [ghAuthor]);

  return (
    <div
      className={cn(
        'flex h-44 w-full flex-col justify-between rounded-xl border-3 border-gray-800 bg-dark p-4 text-xs shadow-xl xl:h-48 xl:text-sm 3xl:h-52 3xl:text-base',
        { 'gradient-border-box': checked }
      )}
    >
      <div className="flex w-full justify-between">
        <div>{title.length > 60 ? title.slice(0, 60) + '...' : title}</div>
        <AnchorLink
          href={link || ''}
          target="_blank"
          className="ml-2 h-9 w-9 translate-x-2 -translate-y-2 rounded-full bg-gray-800 p-2"
        >
          <LinkIcon />
        </AnchorLink>
      </div>
      <div className="flex w-full flex-col">
        <div>
          Amount Staked:{' '}
          {Math.round((amountStaked * 100) / 10 ** tokenDecimals) / 100}{' '}
          {tokenSymbol}
        </div>
        <div>Author Github: {githubUsername}</div>
        <div>
          Author PublicKey:{' '}
          {pubKeyAuthor.slice(0, 5) + '...' + pubKeyAuthor.slice(37, 42)}
        </div>
      </div>
    </div>
  );
};

interface PRSliderProps {
  PRs: any;
  selectedPR: any;
  setSelectedPR: React.Dispatch<React.SetStateAction<any>>;
  issueTokenAddress: string;
}

export default function PRSlider({
  PRs,
  selectedPR,
  setSelectedPR,
  issueTokenAddress,
}: PRSliderProps) {
  const [tokenSymbol, setTokenSymbol] = useState('');
  let [tokenDecimals, setTokenDecimals] = useState(0);

  useEffect(() => {
    getDecimals();
    axios
      .get(
        `https://api.solscan.io/account?address=${issueTokenAddress}&cluster=devnet`,
        {
          headers: {
            token: process.env.SOLSCAN_TOKEN,
          },
        }
      )
      .then((res) => {
        setTokenSymbol(res.data.data.metadata.data.symbol);
      });
  }, [issueTokenAddress]);

  const getDecimals = async () => {
    const decimals = await fetchDecimals(issueTokenAddress);
    setTokenDecimals(decimals);
  };

  return (
    <div className="w-full">
      <Swiper
        modules={[Scrollbar, A11y]}
        spaceBetween={20}
        slidesPerView={3}
        scrollbar={{ draggable: true }}
        observer={true}
        dir="ltr"
        className="[&_.swiper-scrollbar_>_.swiper-scrollbar-drag]:bg-body/50"
      >
        {PRs.map((PR: any, idx: number) => (
          <SwiperSlide key={idx} onClick={() => setSelectedPR(PR)}>
            <PRCard
              title={PR?.issue_title}
              amountStaked={PR?.issue_vote_amount}
              ghAuthor={PR?.issue_pr_github}
              pubKeyAuthor={PR?.issue_pr_author}
              link={PR?.issue_pr_link}
              checked={selectedPR !== undefined ? PR == selectedPR : false}
              tokenSymbol={tokenSymbol}
              tokenDecimals={tokenDecimals}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
