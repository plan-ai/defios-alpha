import { FC, ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  useLocalStorage,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import {
  PhantomWalletAdapter,
  GlowWalletAdapter,
} from '@solana/wallet-adapter-wallets';
require('@solana/wallet-adapter-react-ui/styles.css');

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const url = useMemo(() => clusterApiUrl('devnet'), []);
  const phantom = useMemo(() => new PhantomWalletAdapter(), []);
  const glow = useMemo(() => new GlowWalletAdapter(), []);

  return (
    <ConnectionProvider endpoint={url}>
      <WalletProvider wallets={[phantom, glow]} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
