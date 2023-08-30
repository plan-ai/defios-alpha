import cn from 'classnames';
import AuthorCard from '@/components/ui/author-card';
import Logo from '@/components/ui/logo';
import { MenuItem } from '@/components/ui/collapsible-menu';
import Scrollbar from '@/components/ui/scrollbar';
import Button from '@/components/ui/button';
import { useDrawer } from '@/components/drawer-views/context';
import { Close } from '@/components/icons/close';
import { menuItems } from '@/layouts/sidebar/_menu-items';
//images
import { useWallet } from '@solana/wallet-adapter-react';
import { solAirdrop } from '@/lib/helpers/contractInteract';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { onLoading, onFailure, onSuccess } from '@/store/callLoaderSlice';

import Link from 'next/link';

import mixpanel from 'mixpanel-browser';

export default function Sidebar({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const stateLoading = useAppSelector((state) => state.callLoader.callState);

  const { closeDrawer } = useDrawer();
  const githubInfo = useAppSelector((state) => state.userInfo.githubInfo);
  const wallet = useWallet();

  const handleAirdrop = async () => {
    if (!wallet || wallet.publicKey === null) return;
    let resCalled = false;
    dispatch(onLoading('Airdropping 2 Devnet SOL...'));
    solAirdrop(wallet.publicKey)
      .then((res) => {
        resCalled = true;
        console.log(res);
        dispatch(
          onSuccess({
            label: 'Airdop Devnet SOL Successful',
            description: 'check out the tx at',
            redirect: null,
            link: res
              ? `https://solscan.io/tx/${res.toString()}?cluster=devnet`
              : '',
          })
        );
        mixpanel.track('Airdop Devnet SOL Success', {
          pubkey: wallet.publicKey,
          tx_link: res
            ? `https://solscan.io/tx/${res.toString()}?cluster=devnet`
            : '',
        });
      })
      .catch((err) => {
        resCalled = true;
        dispatch(
          onFailure({
            label: 'Airdop Devnet SOL Failed',
            description: err.message,
            redirect: null,
            link: '',
          })
        );
        mixpanel.track('Airdop Devnet SOL Failed', {
          pubkey: wallet.publicKey,
          error: err.message,
        });
      })
      .finally(() => {
        if (!resCalled) {
          dispatch(
            onSuccess({
              label: 'Airdop Devnet SOL Successful',
              description: '',
              redirect: null,
              link: '',
            })
          );
          mixpanel.track('Airdop Devnet SOL Success', {
            pubkey: wallet.publicKey,
          });
        }
      });
  };

  return (
    <div
      className={cn(
        'fixed top-0 left-0 bottom-0 z-40 flex h-full w-full w-[15rem] flex-col justify-between overflow-y-auto pt-3 lg:pt-5 xl:w-[16.75rem] 2xl:w-[18.75rem] 3xl:w-[20rem] bg-dark',
        className
      )}
    >
      <div className="lineGradient absolute top-0 bottom-0 right-0 ml-2 w-0.5"></div>
      <div className="relative flex items-center px-6 3xl:px-8">
        <div className="lg:hidden">
          <Button
            title="Close"
            shape="circle"
            variant="solid"
            size="small"
            onClick={closeDrawer}
            className="mr-3"
          >
            <Close className="h-auto w-3" />
          </Button>
        </div>
        <Logo />
      </div>

      <div className="px-6 pb-5 2xl:px-7 3xl:px-8">
        <div className="mt-5 flex flex-col gap-2">
          {menuItems.map((item: any, index: number) => (
            <MenuItem
              key={'default' + item.name + index}
              name={item.name}
              href={item.href}
              icon={item.icon}
              comingSoon={item.comingSoon || undefined}
            />
          ))}
        </div>

        {/* {wallet && wallet.publicKey !== null && (
            <Button
              size="small"
              shape="rounded"
              onClick={handleAirdrop}
              isLoading={stateLoading === 'loading'}
              color="info"
              className="mt-10 xl:mt-12 3xl:mt-16"
            >
              Airdrop Devnet SOL
            </Button>
          )} */}
      </div>
      <Link href="/profile" className="w-full">
        <div className="mb-4 flex w-full flex-col">
          <div className="lineGradientHorizontal h-0.5 w-full"></div>
          <AuthorCard
            image={githubInfo?.avatar_url || ''}
            name={githubInfo?.name || ''}
            role={githubInfo?.login || ''}
          />
        </div>
      </Link>
    </div>
  );
}
