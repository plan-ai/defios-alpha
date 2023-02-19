import { contractAddresses } from '@/config/addresses';
import { Defios } from '@/types/defios';
import { TokenVesting } from '@/types/token_vesting';
import {
  Program,
  AnchorProvider,
  web3,
  Wallet,
  Idl,
  BN,
} from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { DefiOsIDL } from '../../types/idl/defios';
import { TokenVestingIDL } from '../../types/idl/token_vesting';

export const getProvider = async (
  connection: web3.Connection,
  signerWallet: Wallet
) => {
  const provider = new AnchorProvider(connection, signerWallet, {
    commitment: 'processed',
  });
  return provider;
};

export const getDefiOsProgram = async (provider: AnchorProvider) => {
  const program: Program<Defios> = new Program(
    DefiOsIDL,
    contractAddresses.defios,
    provider
  );
  return program;
};

export const getTokenVestingProgram = async (provider: AnchorProvider) => {
  const program: Program<TokenVesting> = new Program(
    TokenVestingIDL,
    contractAddresses.tokenVesting,
    provider
  );
  return program;
};