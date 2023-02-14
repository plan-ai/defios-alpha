import cn from 'classnames';
import { NextSeo } from 'next-seo';
import { useSession, signIn, signOut } from 'next-auth/react';
import Button from '@/components/ui/button/button';

export default function ModernScreen() {
  const { data: session } = useSession();
  return (
    <>
      <NextSeo
        title="Criptic"
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
