/* eslint-disable react-hooks/exhaustive-deps */
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import { useSession, signIn, signOut } from 'next-auth/react';
import Button from '@/components/ui/button/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectUserMapping, getUserMapping } from '@/store/userMappingSlice';
import { useEffect } from 'react';

export default function ModernScreen() {
  const { data: session } = useSession();
  const wallet = useWallet();
  const userMappingState = useAppSelector(selectUserMapping);
  const dispatch = useAppDispatch();

  useEffect(() => {
    //@ts-ignore
    if (
      //@ts-ignore
      session?.user?.id &&
      wallet.publicKey &&
      //@ts-ignore
      session?.accessToken &&
      !userMappingState.isLoading
    ) {
      dispatch(
        getUserMapping({
          //@ts-ignore
          userID: session?.user.id,
          //@ts-ignore
          accessToken: session?.accessToken,
          userPubkey: wallet.publicKey.toBase58(),
        })
      );
    }
    //@ts-ignore
  }, [wallet.publicKey, session?.accessToken, session?.user.id]);
  return (
    <>
      <NextSeo
        title="DefiOS"
        description="Defios - Tokenize your Open Source Project."
      />
      <div className="mb-5 flex w-full items-center justify-center">
        HomePage
      </div>
      <div className="flex h-full w-full items-center justify-center gap-10">
        {!session && (
          <Button
            onClick={() =>
              signIn('github', {
                callbackUrl: `${window.location.origin}`,
              })
            }
            shape="rounded"
            color="info"
          >
            Sign In
          </Button>
        )}
        {session && (
          <Button onClick={() => signOut()} shape="rounded">
            Sign Out
          </Button>
        )}
      </div>
    </>
  );
}
