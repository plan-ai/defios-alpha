import { contractAddresses } from '@/config/addresses';
import { Defios, IDL } from '@/types/idl/defios';
import {
  Program,
  AnchorProvider,
  web3,
  Wallet,
  Idl,
  BN,
} from '@project-serum/anchor';
import {
  clusterApiUrl,
  Keypair,
  PublicKey,
  Transaction,
  ComputeBudgetProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import * as mpl from '@metaplex-foundation/mpl-token-metadata';
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  compareAmounts,
  walletAdapterIdentity,
} from '@metaplex-foundation/js';
import { Signer, Connection } from './wallet';
import {
  fetchTokenMetadata,
  uploadFileToIPFS,
  uploadMetadataToIPFS,
} from './metadata';
import { uploadToIPFS } from '@pinata/sdk';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
  getAssociatedTokenAddress,
  MintLayout,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import axios from '@/lib/axiosClient';

//change
const nameRouterAccount = new PublicKey(
  '7PG2xWFzSphpV66ZruD3P7quYzpR5zeGqRmerHMTQTjQ'
);
const routerCreator = new PublicKey(
  '55kBY9yxqSC42boV8PywT2gqGzgLi5MPAtifNRgPNezF'
);
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

export const getProvider = async (
  connection: web3.Connection,
  signerWallet: any
) => {
  const provider = new AnchorProvider(connection, signerWallet, {});
  return provider;
};

export const getDefiOsProgram = async (provider: AnchorProvider) => {
  const program: Program<Defios> = new Program(
    IDL,
    contractAddresses.defios,
    provider
  );
  return program;
};

export const solAirdrop = async (address: PublicKey) => {
  return new Promise<any>(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    provider.connection
      .requestAirdrop(address, 2 * web3.LAMPORTS_PER_SOL)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const get_pda_from_seeds = async (seeds: any, program: any) => {
  return await web3.PublicKey.findProgramAddressSync(seeds, program.programId);
};

async function get_metadata_account(mintKeypair: any) {
  return (
    await web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
}

export const createRepository = (
  repositoryCreator: PublicKey,
  repoName: string,
  repoLink: string,
  tokenName: string,
  tokenSymbol: string,
  tokenMetadata: string,
  repositoryVerifiedUser: PublicKey
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(Connection, Signer);
      const metaplex = await Metaplex.make(Connection);
      const program = await getDefiOsProgram(provider);

      const [repositoryAccount] = await get_pda_from_seeds(
        [
          Buffer.from('repository'),
          Buffer.from(repoName),
          Signer.publicKey.toBuffer(),
        ],
        program
      );
      const [mintKeypair] = await get_pda_from_seeds(
        [
          Buffer.from('Miners'),
          Buffer.from('MinerC'),
          repositoryAccount.toBuffer(),
        ],
        program
      );
      const metadataAddress = await get_metadata_account(mintKeypair);
      const [vestingAccount] = await get_pda_from_seeds(
        [Buffer.from('vesting'), repositoryAccount.toBuffer()],
        program
      );
      const vestingTokenAccount = await getAssociatedTokenAddress(
        mintKeypair,
        vestingAccount,
        true
      );
      const repositoryCreatorTokenAccount = await getAssociatedTokenAddress(
        mintKeypair,
        Signer.publicKey
      );
      const [defaultVestingSchedule] = await get_pda_from_seeds(
        [
          Buffer.from('isGodReal?'),
          Buffer.from('DoULoveMe?'),
          Buffer.from('SweetChick'),
        ],
        program
      );

      await program.methods
        .createRepository(
          repoName,
          'Open source revolution',
          repoLink,
          tokenName,
          tokenSymbol,
          tokenMetadata
        )
        .accounts({
          repositoryAccount,
          repositoryCreatorTokenAccount,
          repositoryCreator: repositoryCreator,
          repositoryVerifiedUser: repositoryVerifiedUser,
          rewardsMint: mintKeypair,
          systemProgram: web3.SystemProgram.programId,
          vestingAccount: vestingAccount,
          vestingTokenAccount: vestingTokenAccount,
          defaultSchedule: defaultVestingSchedule,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          metadata: metadataAddress,
          importedMint: null,
          rent: web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc({ skipPreflight: false, maxRetries: 3 })
        .then((res) => {
          // let data = JSON.stringify({
          //   mintKeypair: mintKeypair.toString(),
          // });

          // let config = {
          //   method: 'post',
          //   maxBodyLength: Infinity,
          //   url: 'https://namespaces.defi-os.com/createCommunalAccount',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   data: data,
          // };

          // axios(config);
          resolve(repositoryAccount);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const createRepositoryUnlockIssueStake = (
  //repo
  repositoryCreator: PublicKey,
  repoName: string,
  repoDescription: string,
  repoLink: string,
  tokenName: string,
  tokenSymbol: string,
  tokenMetadata: string,
  repositoryVerifiedUser: PublicKey,
  //issue
  issueURI: string,
  //stake
  tokenAmount: number,
  usdcAmount: number
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(Connection, Signer);
      const metaplex = await Metaplex.make(Connection);
      const program = await getDefiOsProgram(provider);

      const [repositoryAccount] = await get_pda_from_seeds(
        [
          Buffer.from('repository'),
          Buffer.from(repoName),
          Signer.publicKey.toBuffer(),
        ],
        program
      );
      const [mintKeypair] = await get_pda_from_seeds(
        [
          Buffer.from('Miners'),
          Buffer.from('MinerC'),
          repositoryAccount.toBuffer(),
        ],
        program
      );
      const metadataAddress = await get_metadata_account(mintKeypair);
      const [vestingAccount] = await get_pda_from_seeds(
        [Buffer.from('vesting'), repositoryAccount.toBuffer()],
        program
      );
      const vestingTokenAccount = await getAssociatedTokenAddress(
        mintKeypair,
        vestingAccount,
        true
      );
      const repositoryCreatorTokenAccount = await getAssociatedTokenAddress(
        mintKeypair,
        Signer.publicKey
      );
      const [defaultVestingSchedule] = await get_pda_from_seeds(
        [
          Buffer.from('isGodReal?'),
          Buffer.from('DoULoveMe?'),
          Buffer.from('SweetChick'),
        ],
        program
      );

      const ixUnlock = await program.methods
        .unlockTokens()
        .accounts({
          repositoryAccount,
          repositoryCreatorTokenAccount,
          repositoryCreator,
          systemProgram: web3.SystemProgram.programId,
          vestingAccount: vestingAccount,
          tokenMint: mintKeypair,
          vestingTokenAccount: vestingTokenAccount,
        })
        .instruction();

      const [issueAccount] = await get_pda_from_seeds(
        [
          Buffer.from('issue'),
          Buffer.from('0'),
          repositoryAccount.toBuffer(),
          repositoryCreator.toBuffer(),
        ],
        program
      );

      const issueTokenPoolAccount = await getAssociatedTokenAddress(
        mintKeypair,
        issueAccount,
        true
      );

      const ixIssueCreate = await program.methods
        .addIssue(issueURI)
        .accounts({
          issueAccount,
          issueCreator: repositoryCreator,
          issueVerifiedUser: repositoryVerifiedUser,
          repositoryAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .instruction();

      const [issueStakerAccount] = await get_pda_from_seeds(
        [
          Buffer.from('issuestaker'),
          issueAccount.toBuffer(),
          repositoryCreator.toBuffer(),
        ],
        program
      );

      const issueStakerTokenAccount = await getAssociatedTokenAddress(
        mintKeypair,
        repositoryCreator
      );

      const ixTokenStake = await program.methods
        .stakeIssue(new BN(tokenAmount * 10))
        .accounts({
          issueAccount,
          repositoryAccount,
          issueTokenPoolAccount,
          issueStaker: repositoryCreator,
          issueStakerAccount,
          issueStakerTokenAccount: issueStakerTokenAccount,
          rewardsMint: mintKeypair,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          pullRequestMetadataAccount: null,
        })
        .instruction();

      const usdcMint = new PublicKey(
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
      );

      const issueStakerUsdcAccount = await getAssociatedTokenAddress(
        usdcMint,
        repositoryCreator
      );

      const issueUsdcPoolAccount = await getAssociatedTokenAddress(
        usdcMint,
        issueAccount,
        true
      );

      const ixUsdcStake = await program.methods
        .stakeIssue(new BN(usdcAmount * 10 ** 6))
        .accounts({
          issueAccount,
          repositoryAccount,
          issueTokenPoolAccount: issueUsdcPoolAccount,
          issueStaker: repositoryCreator,
          issueStakerAccount,
          issueStakerTokenAccount: issueStakerUsdcAccount,
          rewardsMint: usdcMint,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          pullRequestMetadataAccount: null,
        })
        .instruction();

      const arrNoStake = [ixUnlock, ixIssueCreate];

      const arrOnlyTokenStake = [ixUnlock, ixIssueCreate, ixTokenStake];
      const arrOnlyUsdcStake = [ixUnlock, ixIssueCreate, ixUsdcStake];

      const arrAllStake = [ixUnlock, ixIssueCreate, ixTokenStake, ixUsdcStake];

      let postIxs: web3.TransactionInstruction[] = arrNoStake;

      if (tokenAmount > 0 && usdcAmount * 10 ** 6 > 0) {
        postIxs = arrAllStake;
      } else if (tokenAmount > 0) {
        postIxs = arrOnlyTokenStake;
      } else if (usdcAmount * 10 ** 6 > 0) {
        postIxs = arrOnlyUsdcStake;
      } else {
        postIxs = arrNoStake;
      }

      await program.methods
        .createRepository(
          repoName,
          repoDescription,
          repoLink,
          tokenName,
          tokenSymbol,
          tokenMetadata
        )
        .accounts({
          repositoryAccount,
          repositoryCreatorTokenAccount,
          repositoryCreator: repositoryCreator,
          repositoryVerifiedUser: repositoryVerifiedUser,
          rewardsMint: mintKeypair,
          systemProgram: web3.SystemProgram.programId,
          vestingAccount: vestingAccount,
          vestingTokenAccount: vestingTokenAccount,
          defaultSchedule: defaultVestingSchedule,
          metadata: metadataAddress,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          importedMint: null,
          rent: web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .postInstructions(postIxs)
        .rpc({ skipPreflight: false, maxRetries: 3 })
        .then((res) => {
          // let data = JSON.stringify({
          //   mintKeypair: mintKeypair.toString(),
          // });

          // let config = {
          //   method: 'post',
          //   maxBodyLength: Infinity,
          //   url: 'https://namespaces.defi-os.com/createCommunalAccount',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   data: data,
          // };

          // axios(config);
          resolve(repositoryAccount);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const createRepositoryImported = (
  repositoryCreator: PublicKey,
  repoName: string,
  repoLink: string,
  repositoryVerifiedUser: PublicKey,
  tokenAddress: string,
  tokenName: string,
  tokenSymbol: string,
  tokenImage: string,
  firebase_jwt: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(Connection, Signer);
      const program = await getDefiOsProgram(provider);

      const [repositoryAccount] = await get_pda_from_seeds(
        [
          Buffer.from('repository'),
          Buffer.from(repoName),
          Signer.publicKey.toBuffer(),
        ],
        program
      );
      const [defaultVestingSchedule] = await get_pda_from_seeds(
        [
          Buffer.from('isGodReal?'),
          Buffer.from('DoULoveMe?'),
          Buffer.from('SweetChick'),
        ],
        program
      );

      program.methods
        .createRepository(
          repoName,
          'Open source revolution',
          repoLink,
          null,
          null,
          null
        )
        .accounts({
          repositoryAccount,
          repositoryCreatorTokenAccount: null,
          repositoryCreator: repositoryCreator,
          repositoryVerifiedUser: repositoryVerifiedUser,
          rewardsMint: null,
          systemProgram: web3.SystemProgram.programId,
          vestingAccount: null,
          vestingTokenAccount: null,
          defaultSchedule: defaultVestingSchedule,
          metadata: null,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          importedMint: new PublicKey(tokenAddress),
          rent: web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc({ skipPreflight: false, maxRetries: 3 })
        .then(() => {
          let data = JSON.stringify({
            name: tokenName,
            symbol: tokenSymbol,
            image: tokenImage,
            spl_addr: tokenAddress,
          });

          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${
              process.env.NEXT_PUBLIC_DEFIOS_SERVER
            }m/projects?project_key=${repositoryAccount.toString()}`,
            headers: {
              Authorization: firebase_jwt,
              'Content-Type': 'application/json',
            },
            data: data,
          };
          axios(config);
          resolve(repositoryAccount);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const createRepositoryImportedIssueStake = (
  //repo
  repositoryCreator: PublicKey,
  repoName: string,
  repoDescription: string,
  repoLink: string,
  repositoryVerifiedUser: PublicKey,
  tokenAddress: string,
  tokenName: string,
  tokenSymbol: string,
  tokenImage: string,
  firebase_jwt: string,
  //issue
  issueURI: string,
  //stake
  tokenAmount: number,
  usdcAmount: number
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(Connection, Signer);
      const program = await getDefiOsProgram(provider);

      const [repositoryAccount] = await get_pda_from_seeds(
        [
          Buffer.from('repository'),
          Buffer.from(repoName),
          Signer.publicKey.toBuffer(),
        ],
        program
      );
      const [defaultVestingSchedule] = await get_pda_from_seeds(
        [
          Buffer.from('isGodReal?'),
          Buffer.from('DoULoveMe?'),
          Buffer.from('SweetChick'),
        ],
        program
      );

      const [issueAccount] = await get_pda_from_seeds(
        [
          Buffer.from('issue'),
          Buffer.from('0'),
          repositoryAccount.toBuffer(),
          repositoryCreator.toBuffer(),
        ],
        program
      );

      const issueTokenPoolAccount = await getAssociatedTokenAddress(
        new PublicKey(tokenAddress),
        issueAccount,
        true
      );

      const ixIssueCreate = await program.methods
        .addIssue(issueURI)
        .accounts({
          issueAccount,
          issueCreator: repositoryCreator,
          issueVerifiedUser: repositoryVerifiedUser,
          repositoryAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .instruction();

      const [issueStakerAccount] = await get_pda_from_seeds(
        [
          Buffer.from('issuestaker'),
          issueAccount.toBuffer(),
          repositoryCreator.toBuffer(),
        ],
        program
      );

      const issueStakerTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(tokenAddress),
        repositoryCreator
      );

      let tokenMetadata = await fetchTokenMetadata(tokenAddress);
      if (!tokenMetadata.decimals) {
        tokenMetadata = await axios
          .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/tokens`, {
            headers: {
              Authorization: firebase_jwt,
            },
            params: {
              token_addr: tokenAddress,
            },
          })
          .then((res) => {
            const response = { ...res.data };
            response.decimals = res.data.token_decimals;
            return response;
          });
      }
      if (!tokenMetadata.decimals) {
        reject('cannot find decimals of token');
      }
      const transferAmount = tokenAmount * 10 ** tokenMetadata.decimals;

      const ixTokenStake = await program.methods
        .stakeIssue(new BN(transferAmount))
        .accounts({
          issueAccount,
          repositoryAccount,
          issueTokenPoolAccount,
          issueStaker: repositoryCreator,
          issueStakerAccount,
          issueStakerTokenAccount: issueStakerTokenAccount,
          rewardsMint: new PublicKey(tokenAddress),
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          pullRequestMetadataAccount: null,
        })
        .instruction();

      const usdcMint = new PublicKey(
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
      );

      const issueStakerUsdcAccount = await getAssociatedTokenAddress(
        usdcMint,
        repositoryCreator
      );

      const issueUsdcPoolAccount = await getAssociatedTokenAddress(
        usdcMint,
        issueAccount,
        true
      );

      const ixUsdcStake = await program.methods
        .stakeIssue(new BN(usdcAmount * 10 ** 6))
        .accounts({
          issueAccount,
          repositoryAccount,
          issueTokenPoolAccount: issueUsdcPoolAccount,
          issueStaker: repositoryCreator,
          issueStakerAccount,
          issueStakerTokenAccount: issueStakerUsdcAccount,
          rewardsMint: usdcMint,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          pullRequestMetadataAccount: null,
        })
        .instruction();

      const arrNoStake = [ixIssueCreate];

      const arrOnlyTokenStake = [ixIssueCreate, ixTokenStake];
      const arrOnlyUsdcStake = [ixIssueCreate, ixUsdcStake];

      const arrAllStake = [ixIssueCreate, ixTokenStake, ixUsdcStake];

      let postIxs: web3.TransactionInstruction[] = arrNoStake;

      if (tokenAmount > 0 && usdcAmount * 10 ** 6 > 0) {
        postIxs = arrAllStake;
      } else if (tokenAmount > 0) {
        postIxs = arrOnlyTokenStake;
      } else if (usdcAmount * 10 ** 6 > 0) {
        postIxs = arrOnlyUsdcStake;
      } else {
        postIxs = arrNoStake;
      }

      program.methods
        .createRepository(repoName, repoDescription, repoLink, null, null, null)
        .accounts({
          repositoryAccount,
          repositoryCreatorTokenAccount: null,
          repositoryCreator: repositoryCreator,
          repositoryVerifiedUser: repositoryVerifiedUser,
          rewardsMint: null,
          systemProgram: web3.SystemProgram.programId,
          vestingAccount: null,
          vestingTokenAccount: null,
          defaultSchedule: defaultVestingSchedule,
          metadata: null,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          importedMint: new PublicKey(tokenAddress),
          rent: web3.SYSVAR_RENT_PUBKEY,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .postInstructions(postIxs)
        .rpc({ skipPreflight: false, maxRetries: 3 })
        .then(() => {
          let data = JSON.stringify({
            name: tokenName,
            symbol: tokenSymbol,
            image: tokenImage,
            spl_addr: tokenAddress,
          });

          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${
              process.env.NEXT_PUBLIC_DEFIOS_SERVER
            }/projects?project_key=${repositoryAccount.toString()}`,
            headers: {
              Authorization: firebase_jwt,
              'Content-Type': 'application/json',
            },
            data: data,
          };
          axios(config);
          resolve(repositoryAccount);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const createIssue = (
  issueCreator: PublicKey,
  issueURI: string,
  repositoryAccount: PublicKey,
  issueVerifiedUser: PublicKey,
  tokenAddress: PublicKey
) => {
  return new Promise<PublicKey>(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const { repositoryCreator } = await program.account.repository.fetch(
      repositoryAccount
    );

    const { issueIndex } = await program.account.repository.fetch(
      repositoryAccount
    );

    const [issueAccount] = await get_pda_from_seeds(
      [
        Buffer.from('issue'),
        Buffer.from(issueIndex.toString()),
        repositoryAccount.toBuffer(),
        issueCreator.toBuffer(),
      ],
      program
    );

    program.methods
      .addIssue(issueURI)
      .accounts({
        issueAccount,
        issueCreator: issueCreator,
        issueVerifiedUser,
        repositoryAccount,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc({ skipPreflight: false, maxRetries: 3 })
      .then((res) => {
        resolve(issueAccount);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const createIssueStake = (
  issueCreator: PublicKey,
  issueURI: string,
  repositoryAccount: PublicKey,
  issueVerifiedUser: PublicKey,
  tokenAmount: number,
  usdcAmount: number,
  firebase_jwt: string
) => {
  return new Promise<PublicKey>(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const { rewardsMint } = await program.account.repository.fetch(
      repositoryAccount
    );

    const { issueIndex } = await program.account.repository.fetch(
      repositoryAccount
    );

    const [issueAccount] = await get_pda_from_seeds(
      [
        Buffer.from('issue'),
        Buffer.from(issueIndex.toString()),
        repositoryAccount.toBuffer(),
        issueCreator.toBuffer(),
      ],
      program
    );

    const mintKeypair = rewardsMint;

    const issueTokenPoolAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueAccount,
      true
    );

    const [issueStakerAccount] = await get_pda_from_seeds(
      [
        Buffer.from('issuestaker'),
        issueAccount.toBuffer(),
        issueCreator.toBuffer(),
      ],
      program
    );

    const issueStakerTokenAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueCreator
    );

    let tokenMetadata = await fetchTokenMetadata(mintKeypair.toString());
    if (!tokenMetadata.decimals) {
      tokenMetadata = await axios
        .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/tokens`, {
          headers: {
            Authorization: firebase_jwt,
          },
          params: {
            token_addr: mintKeypair.toString(),
          },
        })
        .then((res) => {
          const response = { ...res.data };
          response.decimals = res.data.token_decimals;
          return response;
        });
    }
    if (!tokenMetadata.decimals) {
      reject('cannot find decimals of token');
    }
    const transferAmount = tokenAmount * 10 ** tokenMetadata.decimals;

    const ixTokenStake = await program.methods
      .stakeIssue(new BN(transferAmount))
      .accounts({
        issueAccount,
        repositoryAccount: repositoryAccount,
        issueTokenPoolAccount,
        issueStaker: issueCreator,
        issueStakerAccount,
        issueStakerTokenAccount: issueStakerTokenAccount,
        rewardsMint: mintKeypair,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        pullRequestMetadataAccount: null,
      })
      .instruction();

    const usdcMint = new PublicKey(
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    );

    const issueStakerUsdcAccount = await getAssociatedTokenAddress(
      usdcMint,
      issueCreator
    );

    const issueUsdcPoolAccount = await getAssociatedTokenAddress(
      usdcMint,
      issueAccount,
      true
    );

    const ixUsdcStake = await program.methods
      .stakeIssue(new BN(usdcAmount * 10 ** 6))
      .accounts({
        issueAccount,
        repositoryAccount: repositoryAccount,
        issueTokenPoolAccount: issueUsdcPoolAccount,
        issueStaker: issueCreator,
        issueStakerAccount,
        issueStakerTokenAccount: issueStakerUsdcAccount,
        rewardsMint: usdcMint,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        pullRequestMetadataAccount: null,
      })
      .instruction();

    let ixArr: web3.TransactionInstruction[] = [];

    if (tokenAmount > 0 && usdcAmount > 0) {
      ixArr = [ixTokenStake, ixUsdcStake];
    } else if (tokenAmount > 0) {
      ixArr = [ixTokenStake];
    } else if (usdcAmount > 0) {
      ixArr = [ixUsdcStake];
    }

    program.methods
      .addIssue(issueURI)
      .accounts({
        issueAccount,
        issueCreator: issueCreator,
        issueVerifiedUser,
        repositoryAccount,
        systemProgram: web3.SystemProgram.programId,
      })
      .postInstructions(ixArr)
      .rpc({ skipPreflight: false, maxRetries: 3 })
      .then((res) => {
        resolve(issueAccount);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const stakeIssueTokens = (
  issueStaker: PublicKey,
  issueAccount: PublicKey,
  tokenAmount: number,
  usdcAmount: number,
  firebase_jwt: string
) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const { repository } = await program.account.issue.fetch(issueAccount);
    const { rewardsMint } = await program.account.repository.fetch(repository);

    const mintKeypair = rewardsMint;

    const issueTokenPoolAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueAccount,
      true
    );

    const [issueStakerAccount] = await get_pda_from_seeds(
      [
        Buffer.from('issuestaker'),
        issueAccount.toBuffer(),
        issueStaker.toBuffer(),
      ],
      program
    );

    const issueStakerTokenAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueStaker
    );

    let tokenMetadata = await fetchTokenMetadata(mintKeypair.toString());
    if (!tokenMetadata.decimals) {
      tokenMetadata = await axios
        .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/tokens`, {
          headers: {
            Authorization: firebase_jwt,
          },
          params: {
            token_addr: mintKeypair.toString(),
          },
        })
        .then((res) => {
          const response = { ...res.data };
          response.decimals = res.data.token_decimals;
          return response;
        });
    }
    if (!tokenMetadata.decimals) {
      reject('cannot find decimals of token');
    }
    const transferAmount = tokenAmount * 10 ** tokenMetadata.decimals;

    const ixTokenStake = await program.methods
      .stakeIssue(new BN(transferAmount))
      .accounts({
        issueAccount,
        repositoryAccount: repository,
        issueTokenPoolAccount,
        issueStaker: issueStaker,
        issueStakerAccount,
        issueStakerTokenAccount: issueStakerTokenAccount,
        rewardsMint: mintKeypair,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        pullRequestMetadataAccount: null,
      });

    const usdcMint = new PublicKey(
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    );

    const issueStakerUsdcAccount = await getAssociatedTokenAddress(
      usdcMint,
      issueStaker
    );

    const issueUsdcPoolAccount = await getAssociatedTokenAddress(
      usdcMint,
      issueAccount,
      true
    );

    const ixUsdcStake = await program.methods
      .stakeIssue(new BN(usdcAmount * 10 ** 6))
      .accounts({
        issueAccount,
        repositoryAccount: repository,
        issueTokenPoolAccount: issueUsdcPoolAccount,
        issueStaker: issueStaker,
        issueStakerAccount,
        issueStakerTokenAccount: issueStakerUsdcAccount,
        rewardsMint: usdcMint,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        pullRequestMetadataAccount: null,
      });

    if (tokenAmount > 0 && usdcAmount > 0) {
      const instUsdc = await ixUsdcStake.instruction();
      await ixTokenStake
        .postInstructions([instUsdc])
        .rpc({ skipPreflight: false, maxRetries: 3 })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    } else if (tokenAmount > 0) {
      await ixTokenStake
        .rpc({ skipPreflight: false, maxRetries: 3 })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    } else if (usdcAmount > 0) {
      await ixUsdcStake
        .rpc({ skipPreflight: false, maxRetries: 3 })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    } else {
      reject('no stake amount');
    }
  });
};

export const stakeIssue = (
  issueStaker: PublicKey,
  issueAccount: PublicKey,
  amount: number,
  tokenAddress: PublicKey,
  firebase_jwt: string
) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const { repository } = await program.account.issue.fetch(issueAccount);
    const { rewardsMint } = await program.account.repository.fetch(repository);

    const [issueStakerAccount] = await get_pda_from_seeds(
      [
        Buffer.from('issuestaker'),
        issueAccount.toBuffer(),
        issueStaker.toBuffer(),
      ],
      program
    );

    const mintKeypair = tokenAddress;

    const issueStakerTokenAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueStaker
    );

    const issueTokenPoolAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueAccount,
      true
    );

    let tokenMetadata = await fetchTokenMetadata(mintKeypair.toString());
    if (!tokenMetadata.decimals) {
      tokenMetadata = await axios
        .get(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/tokens`, {
          headers: {
            Authorization: firebase_jwt,
          },
          params: {
            token_addr: mintKeypair.toString(),
          },
        })
        .then((res) => {
          const response = { ...res.data };
          response.decimals = res.data.token_decimals;
          return response;
        });
    }
    if (!tokenMetadata.decimals) {
      reject('cannot find decimals of token');
    }
    const transferAmount = amount * 10 ** tokenMetadata.decimals;

    program.methods
      .stakeIssue(new BN(transferAmount))
      .accounts({
        issueAccount,
        repositoryAccount: repository,
        issueTokenPoolAccount,
        issueStaker: issueStaker,
        issueStakerAccount,
        issueStakerTokenAccount: issueStakerTokenAccount,
        rewardsMint: mintKeypair,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc({ skipPreflight: false, maxRetries: 3 })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const unstakeIssueTokens = (
  issueStaker: PublicKey,
  issueAccount: PublicKey
) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const { repository } = await program.account.issue.fetch(issueAccount);
    const { rewardsMint } = await program.account.repository.fetch(repository);

    const mintKeypair = rewardsMint;

    const issueTokenPoolAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueAccount,
      true
    );

    const [issueStakerAccount] = await get_pda_from_seeds(
      [
        Buffer.from('issuestaker'),
        issueAccount.toBuffer(),
        issueStaker.toBuffer(),
      ],
      program
    );

    const issueStakerTokenAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueStaker
    );

    const ixTokenUnstake = await program.methods.unstakeIssue().accounts({
      issueAccount,
      repositoryAccount: repository,
      issueTokenPoolAccount,
      issueStaker: issueStaker,
      issueStakerAccount,
      issueStakerTokenAccount: issueStakerTokenAccount,
      rewardsMint: mintKeypair,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    });

    const usdcMint = new PublicKey(
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    );

    const issueStakerUsdcAccount = await getAssociatedTokenAddress(
      usdcMint,
      issueStaker
    );

    const issueUsdcPoolAccount = await getAssociatedTokenAddress(
      usdcMint,
      issueAccount,
      true
    );

    const ixUsdcUnstake = await program.methods
      .unstakeIssue()
      .accounts({
        issueAccount,
        repositoryAccount: repository,
        issueTokenPoolAccount: issueUsdcPoolAccount,
        issueStaker: issueStaker,
        issueStakerAccount,
        issueStakerTokenAccount: issueStakerUsdcAccount,
        rewardsMint: usdcMint,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();

    await ixTokenUnstake
      // .postInstructions([ixUsdcUnstake])
      .rpc({ skipPreflight: false, maxRetries: 3 })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const unstakeIssue = (
  issueStaker: PublicKey,
  issueAccount: PublicKey,
  tokenAddress: PublicKey
) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const { repository } = await program.account.issue.fetch(issueAccount);
    const { rewardsMint } = await program.account.repository.fetch(repository);

    const [issueStakerAccount] = await get_pda_from_seeds(
      [
        Buffer.from('issuestaker'),
        issueAccount.toBuffer(),
        issueStaker.toBuffer(),
      ],
      program
    );

    const mintKeypair = tokenAddress;

    const issueStakerTokenAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueStaker
    );

    const issueTokenPoolAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueAccount,
      true
    );

    program.methods
      .unstakeIssue()
      .accounts({
        issueAccount,
        repositoryAccount: repository,
        issueTokenPoolAccount,
        issueStaker: issueStaker,
        issueStakerAccount,
        issueStakerTokenAccount: issueStakerTokenAccount,
        rewardsMint: mintKeypair,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ skipPreflight: false, maxRetries: 3 })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const addPullRequest = (
  commitCreator: PublicKey,
  issueAccount: PublicKey,
  commitVerifiedUser: PublicKey,
  treeHashUnsliced: string,
  commitHashUnsliced: string,
  metadataURI: string
) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);
    const treeHash = treeHashUnsliced.slice(0, 8);
    const commitHash = commitHashUnsliced.slice(0, 8);
    const { repository } = await program.account.issue.fetch(issueAccount);

    const [commitAccount] = await get_pda_from_seeds(
      [
        Buffer.from('commit'),
        Buffer.from(commitHash),
        commitCreator.toBuffer(),
        issueAccount.toBuffer(),
      ],
      program
    );

    const [pullRequestMetadataAccount] = await get_pda_from_seeds(
      [
        Buffer.from('pullrequestadded'),
        issueAccount.toBuffer(),
        commitCreator.toBuffer(),
      ],
      program
    );

    const ixAddPr = await program.methods
      .addPr(metadataURI)
      .accounts({
        pullRequestVerifiedUser: commitVerifiedUser,
        issue: issueAccount,
        pullRequestMetadataAccount: pullRequestMetadataAccount,
        pullRequestAddr: commitCreator,
        systemProgram: web3.SystemProgram.programId,
      })
      .remainingAccounts([
        { pubkey: commitAccount, isWritable: true, isSigner: false },
      ])
      .instruction();

    await program.methods
      .addCommit(commitHash, treeHash, metadataURI)
      .accounts({
        commitAccount,
        commitCreator: commitCreator,
        commitVerifiedUser,
        issueAccount,
        repositoryAccount: repository,
        systemProgram: web3.SystemProgram.programId,
      })
      .postInstructions([ixAddPr])
      .rpc({ skipPreflight: false, maxRetries: 3 })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const votePr = (issueStaker: PublicKey, prAccount: PublicKey) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const { sentBy, commits } = await program.account.pullRequest.fetch(
      prAccount
    );
    const pullRequestAddr = sentBy;
    const commitAccount = commits[0];
    const { issue, commitCreator } = await program.account.commit.fetch(
      commitAccount
    );
    const issueAccount = issue;
    const { repository } = await program.account.issue.fetch(issueAccount);

    const [pullRequestMetadataAccount] = await get_pda_from_seeds(
      [
        Buffer.from('pullrequestadded'),
        issueAccount.toBuffer(),
        commitCreator.toBuffer(),
      ],
      program
    );

    const [issueStakerAccount] = await get_pda_from_seeds(
      [
        Buffer.from('issuestaker'),
        issueAccount.toBuffer(),
        issueStaker.toBuffer(),
      ],
      program
    );

    program.methods
      .votePr()
      .accounts({
        issueStaker: issueStaker,
        repository: repository,
        pullRequestMetadataAccount: pullRequestMetadataAccount,
        issueAccount: issueAccount,
        issueStakerAccount: issueStakerAccount,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc({ skipPreflight: false, maxRetries: 3 })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};


export const acceptPr = (prAccount: PublicKey) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const { sentBy, commits } = await program.account.pullRequest.fetch(
      prAccount
    );
    const pullRequestAddr = sentBy;
    const commitAccount = commits[0];
    const { issue, commitCreator } = await program.account.commit.fetch(
      commitAccount
    );
    const issueAccount = issue;
    const { repository } = await program.account.issue.fetch(issueAccount);
    const { repositoryCreator, id: repositoryId } =
      await program.account.repository.fetch(repository);

    const [pullRequestMetadataAccount] = await get_pda_from_seeds(
      [
        Buffer.from('pullrequestadded'),
        issueAccount.toBuffer(),
        commitCreator.toBuffer(),
      ],
      program
    );

    program.methods
      .acceptPr(repositoryId)
      .accounts({
        pullRequestAddr,
        pullRequestMetadataAccount,
        repositoryCreator,
        repositoryAccount: repository,
        issue: issueAccount,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc({ skipPreflight: false, maxRetries: 3 })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const claimReward = (
  pullRequestAddr: PublicKey,
  prAccount: PublicKey,
  tokenAddress: PublicKey
) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const { commits } = await program.account.pullRequest.fetch(prAccount);
    const commitAccount = commits[0];
    const { issue, commitCreator } = await program.account.commit.fetch(
      commitAccount
    );
    const issueAccount = issue;
    const { repository, issueCreator } = await program.account.issue.fetch(
      issueAccount
    );

    const { repositoryCreator, rewardsMint } =
      await program.account.repository.fetch(repository);

    const mintKeypair = tokenAddress;

    const [pullRequestMetadataAccount] = await get_pda_from_seeds(
      [
        Buffer.from('pullrequestadded'),
        issueAccount.toBuffer(),
        commitCreator.toBuffer(),
      ],
      program
    );

    const issueTokenPoolAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueAccount,
      true
    );

    const pullRequestCreatorRewardAccount = await getAssociatedTokenAddress(
      mintKeypair,
      Signer.publicKey
    );

    program.methods
      .claimReward()
      .accounts({
        pullRequestCreator: pullRequestAddr,
        pullRequest: pullRequestMetadataAccount,
        pullRequestCreatorRewardAccount,
        repositoryCreator: repositoryCreator,
        rewardsMint: mintKeypair,
        repositoryAccount: repository,
        issueAccount: issueAccount,
        issueTokenPoolAccount: issueTokenPoolAccount,
        issueCreator: issueCreator,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc({ skipPreflight: false, maxRetries: 3 })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const unlockTokens = (
  repositoryAccount: PublicKey,
  repositoryCreator: PublicKey,
  tokenAddress: PublicKey
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(Connection, Signer);
      const program = await getDefiOsProgram(provider);

      const { rewardsMint } = await program.account.repository.fetch(
        repositoryAccount
      );

      const mintKeypair = tokenAddress;

      const [vestingAccount] = await get_pda_from_seeds(
        [Buffer.from('vesting'), repositoryAccount.toBuffer()],
        program
      );
      const vestingTokenAccount = await getAssociatedTokenAddress(
        mintKeypair,
        vestingAccount,
        true
      );
      const repositoryCreatorTokenAccount = await getAssociatedTokenAddress(
        mintKeypair,
        Signer.publicKey
      );

      await program.methods
        .unlockTokens()
        .accounts({
          repositoryAccount,
          repositoryCreatorTokenAccount,
          repositoryCreator,
          systemProgram: web3.SystemProgram.programId,
          vestingAccount: vestingAccount,
          tokenMint: mintKeypair,
          vestingTokenAccount: vestingTokenAccount,
        })
        .rpc({ skipPreflight: false, maxRetries: 3 })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const addRoadmapData = (
  roadmapDataAdder: PublicKey,
  roadmapVerifiedUser: PublicKey,
  repositoryAccount: PublicKey,
  roadmapTitle: string,
  roadmapDescription: string,
  roadmapImageUrl: string,
  roadmapOutlook: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(Connection, Signer);
      const program = await getDefiOsProgram(provider);

      const [metadataAccount] = await get_pda_from_seeds(
        [
          Buffer.from('roadmapmetadataadd'),
          repositoryAccount.toBuffer(),
          roadmapDataAdder.toBuffer(),
        ],
        program
      );

      await program.methods
        .addRoadmapData(
          roadmapTitle,
          roadmapDescription,
          roadmapImageUrl,
          roadmapOutlook
        )
        .accounts({
          metadataAccount,
          roadmapDataAdder,
          roadmapVerifiedUser,
          repositoryAccount: repositoryAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc({ skipPreflight: false, maxRetries: 3 })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const addObjectiveData = (
  objectiveDataAddr: PublicKey,
  objectiveVerifiedUser: PublicKey,
  repositoryAccount: PublicKey,
  issueAccount: PublicKey,
  objectiveId: string,
  objectiveTitle: string,
  objectiveDescription: string,
  objectiveDeliverable: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(Connection, Signer);
      const program = await getDefiOsProgram(provider);

      const [objectiveAccount] = await get_pda_from_seeds(
        [
          Buffer.from('objectivedataadd'),
          issueAccount.toBuffer(),
          objectiveDataAddr.toBuffer(),
          Buffer.from(objectiveId),
        ],
        program
      );

      const objectiveStartUnix = new BN(Date.now());

      await program.methods
        .addObjectiveData(
          objectiveId,
          objectiveTitle,
          objectiveStartUnix,
          null,
          objectiveDescription,
          objectiveDeliverable
        )
        .accounts({
          objectiveIssue: issueAccount,
          metadataAccount: objectiveAccount,
          objectiveDataAddr,
          objectiveVerifiedUser,
          repositoryAccount: repositoryAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc({ skipPreflight: false, maxRetries: 3 })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const addObjectiveToRoadmap = (
  objectiveDataAddr: PublicKey,
  objectiveVerifiedUser: PublicKey,
  repositoryAccount: PublicKey,
  issueAccount: PublicKey,
  objectiveId: string,
  objectiveTitle: string,
  objectiveDescription: string,
  objectiveDeliverable: any,
  parentObjectiveAccount: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(Connection, Signer);
      const program = await getDefiOsProgram(provider);

      const [objectiveAccount] = await get_pda_from_seeds(
        [
          Buffer.from('objectivedataadd'),
          issueAccount.toBuffer(),
          objectiveDataAddr.toBuffer(),
          Buffer.from(objectiveId),
        ],
        program
      );

      const [metadataAccount] = await get_pda_from_seeds(
        [
          Buffer.from('roadmapmetadataadd'),
          repositoryAccount.toBuffer(),
          objectiveDataAddr.toBuffer(),
        ],
        program
      );

      const objectiveStartUnix = new BN(Date.now() / 1000);

      const ixAddToRoot = await program.methods
        .addChildObjective()
        .accounts({
          roadmapMetadataAccount:
            parentObjectiveAccount !== null ? null : metadataAccount,
          childObjectiveAdder: objectiveDataAddr,
          parentObjectiveAccount:
            parentObjectiveAccount !== null
              ? new PublicKey(parentObjectiveAccount)
              : null,
          systemProgram: web3.SystemProgram.programId,
        })
        .remainingAccounts([
          { pubkey: objectiveAccount, isWritable: true, isSigner: false },
        ])
        .instruction();

      await program.methods
        .addObjectiveData(
          objectiveId,
          objectiveTitle,
          objectiveStartUnix,
          null,
          objectiveDescription,
          objectiveDeliverable
        )
        .accounts({
          objectiveIssue: issueAccount,
          metadataAccount: objectiveAccount,
          objectiveDataAddr,
          objectiveVerifiedUser,
          repositoryAccount: repositoryAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .postInstructions([ixAddToRoot])
        .rpc({ skipPreflight: false, maxRetries: 3 })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const addChildObjectiveToObjective = (
  childObjectiveAdder: PublicKey,
  parentObjectiveAccount: PublicKey,
  childObjectiveAccount: PublicKey
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(Connection, Signer);
      const program = await getDefiOsProgram(provider);

      await program.methods
        .addChildObjective()
        .accounts({
          roadmapMetadataAccount: null,
          childObjectiveAdder,
          parentObjectiveAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .remainingAccounts([
          { pubkey: childObjectiveAccount, isWritable: true, isSigner: false },
        ])
        .rpc({ skipPreflight: false, maxRetries: 3 })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};

//SWAPS-->

export const buyTransaction = (
  repositoryAccount: PublicKey,
  amount: BN,
  lamports: BN
) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const usdcMint = new PublicKey(
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    );
    const [communal_account_usdc] = await get_pda_from_seeds(
      [
        Buffer.from('are_we_conscious'),
        Buffer.from('is love life ?  '),
        Buffer.from('arewemadorinlove'),
        usdcMint.toBuffer(),
      ],
      program
    );

    const communalUsdcAccount = await getAssociatedTokenAddress(
      usdcMint,
      communal_account_usdc,
      true
    );

    const buyerUsdcAccount = await getAssociatedTokenAddress(
      usdcMint,
      Signer.publicKey
    );

    const { rewardsMint } = await program.account.repository.fetch(
      repositoryAccount
    );
    if (rewardsMint === null) return;

    const [communal_account] = await get_pda_from_seeds(
      [
        Buffer.from('are_we_conscious'),
        Buffer.from('is love life ?  '),
        Buffer.from('arewemadorinlove'),
        rewardsMint.toBuffer(),
      ],
      program
    );

    const communalTokenAccount = await getAssociatedTokenAddress(
      rewardsMint,
      communal_account,
      true
    );

    const buyerTokenAccount = await getAssociatedTokenAddress(
      rewardsMint,
      Signer.publicKey
    );

    const [defaultVestingSchedule] = await get_pda_from_seeds(
      [
        Buffer.from('isGodReal?'),
        Buffer.from('DoULoveMe?'),
        Buffer.from('SweetChick'),
      ],
      program
    );

    const { supplyModified, decimals } = await getSupplyModified(
      rewardsMint.toString()
    );

    if (
      !lamports.eq(
        calculateBuyAmount(
          supplyModified.div(new BN(10).pow(new BN(decimals))),
          amount.div(new BN(10).pow(new BN(decimals)))
        )
      )
    ) {
      reject('Calculation Wrong');
      return;
    }
    await program.methods
      .buyTokens(lamports, amount)
      .accounts({
        buyer: Signer.publicKey,
        communalDeposit: communal_account,
        communalTokenAccount: communalTokenAccount,
        rewardsMint: rewardsMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        repositoryAccount: repositoryAccount,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        buyerTokenAccount,
        defaultSchedule: defaultVestingSchedule,
        communalUsdcAccount,
        buyerUsdcAccount,
        usdcMint,
      })
      .rpc({ skipPreflight: false, maxRetries: 3 })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const sellTransaction = (
  repositoryAccount: PublicKey,
  amount: BN,
  lamports: BN
) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const usdcMint = new PublicKey(
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    );
    const [communal_account_usdc] = await get_pda_from_seeds(
      [
        Buffer.from('are_we_conscious'),
        Buffer.from('is love life ?  '),
        Buffer.from('arewemadorinlove'),
        usdcMint.toBuffer(),
      ],
      program
    );

    const communalUsdcAccount = await getAssociatedTokenAddress(
      usdcMint,
      communal_account_usdc,
      true
    );

    const sellerUsdcAccount = await getAssociatedTokenAddress(
      usdcMint,
      Signer.publicKey
    );

    const { rewardsMint } = await program.account.repository.fetch(
      repositoryAccount
    );
    if (rewardsMint === null) return;

    const [communal_account] = await get_pda_from_seeds(
      [
        Buffer.from('are_we_conscious'),
        Buffer.from('is love life ?  '),
        Buffer.from('arewemadorinlove'),
        rewardsMint.toBuffer(),
      ],
      program
    );

    const communalTokenAccount = await getAssociatedTokenAddress(
      rewardsMint,
      communal_account,
      true
    );

    const sellerTokenAccount = await getAssociatedTokenAddress(
      rewardsMint,
      Signer.publicKey
    );

    const [defaultVestingSchedule] = await get_pda_from_seeds(
      [
        Buffer.from('isGodReal?'),
        Buffer.from('DoULoveMe?'),
        Buffer.from('SweetChick'),
      ],
      program
    );

    const { supplyModified, decimals } = await getSupplyModified(
      rewardsMint.toString()
    );

    if (
      !lamports.eq(
        calculateSellAmount(
          supplyModified.div(new BN(10).pow(new BN(decimals))),
          amount.div(new BN(10).pow(new BN(decimals)))
        )
      )
    ) {
      reject('Calculation Wrong');
      return;
    }

    await program.methods
      .sellTokens(lamports, amount)
      .accounts({
        seller: Signer.publicKey,
        communalDeposit: communal_account,
        communalTokenAccount: communalTokenAccount,
        rewardsMint: rewardsMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        repositoryAccount: repositoryAccount,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        sellerTokenAccount,
        defaultSchedule: defaultVestingSchedule,
        communalUsdcAccount,
        sellerUsdcAccount,
        usdcMint,
      })
      .rpc({ skipPreflight: false, maxRetries: 3 })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

//helpers
//tokenSupply(modified)=tokenSupply(actual)-(number_of_schedules*per_vesting_amount)
// fill this in both calc param of tokenSupply
export const calculateBuyAmount = (tokenSupply: BN, tokenAmount: BN): BN => {
  const newTokenAmount = tokenAmount;
  const newTokenSupply = tokenSupply;
  const value = newTokenAmount
    .pow(new BN(2))
    .add(newTokenSupply.mul(newTokenAmount).muln(2));
  return value;
};

export const calculateSellAmount = (tokenSupply: BN, tokenAmount: BN): BN => {
  const newTokenAmount = tokenAmount;
  const newTokenSupply = tokenSupply;
  const firstValue = newTokenSupply.mul(newTokenAmount).muln(2);
  const secondValue = newTokenAmount.pow(new BN(2));
  if (secondValue.gt(firstValue)) {
    return new BN(0);
  } else {
    return firstValue.sub(secondValue);
  }
};

export const sqrt = (num: BN): BN => {
  if (num.lt(new BN(0))) {
    throw new Error('Sqrt only works on non-negtiave inputs');
  }
  if (num.lt(new BN(2))) {
    return num;
  }

  const smallCand = sqrt(num.shrn(2)).shln(1);
  const largeCand = smallCand.add(new BN(1));

  if (largeCand.mul(largeCand).gt(num)) {
    return smallCand;
  } else {
    return largeCand;
  }
};

export const getAmtOfBuy = (supply: BN, value: BN): BN => {
  const underRootTerm = sqrt(supply.sqr().add(value));
  return underRootTerm.sub(supply);
};

export const getAmtOfSell = (supply: BN, value: BN): BN => {
  return supply.sub(sqrt(supply.sqr().sub(value)));
};

export const getSupplyModified = async (tokenAddress: string) => {
  const provider = await getProvider(Connection, Signer);
  const program = await getDefiOsProgram(provider);

  const tokenInfo = await fetchTokenMetadata(tokenAddress);
  const supplyActual = new BN(tokenInfo.supply.toString());
  const [defaultVestingSchedule] = await get_pda_from_seeds(
    [
      Buffer.from('isGodReal?'),
      Buffer.from('DoULoveMe?'),
      Buffer.from('SweetChick'),
    ],
    program
  );
  const { numberOfSchedules, perVestingAmount } =
    await program.account.defaultVestingSchedule.fetch(defaultVestingSchedule);

  const supplyModified = supplyActual.sub(
    perVestingAmount.muln(numberOfSchedules)
  );

  return { supplyModified, decimals: tokenInfo.decimals, supplyActual };
};

export const swapTransaction = (
  repositoryAccountSell: PublicKey,
  repositoryAccountBuy: PublicKey,
  amountSell: BN,
  amountBuy: BN
) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const { rewardsMint: rewardsMintBuy } =
      await program.account.repository.fetch(repositoryAccountBuy);
    const { rewardsMint: rewardsMintSell } =
      await program.account.repository.fetch(repositoryAccountSell);

    if (rewardsMintBuy === null || rewardsMintSell === null) return;

    const usdcMint = new PublicKey(
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    );
    const [communal_account_usdc] = await get_pda_from_seeds(
      [
        Buffer.from('are_we_conscious'),
        Buffer.from('is love life ?  '),
        Buffer.from('arewemadorinlove'),
        usdcMint.toBuffer(),
      ],
      program
    );

    const communalUsdcAccount = await getAssociatedTokenAddress(
      usdcMint,
      communal_account_usdc,
      true
    );

    const UserUsdcAccount = await getAssociatedTokenAddress(
      usdcMint,
      Signer.publicKey
    );

    const [communal_account_buy] = await get_pda_from_seeds(
      [
        Buffer.from('are_we_conscious'),
        Buffer.from('is love life ?  '),
        Buffer.from('arewemadorinlove'),
        rewardsMintBuy.toBuffer(),
      ],
      program
    );

    const [communal_account_sell] = await get_pda_from_seeds(
      [
        Buffer.from('are_we_conscious'),
        Buffer.from('is love life ?  '),
        Buffer.from('arewemadorinlove'),
        rewardsMintSell.toBuffer(),
      ],
      program
    );

    const communalTokenBuyAccount = await getAssociatedTokenAddress(
      rewardsMintBuy,
      communal_account_buy,
      true
    );

    const communalTokenSellAccount = await getAssociatedTokenAddress(
      rewardsMintSell,
      communal_account_sell,
      true
    );

    const sellerTokenAccount = await getAssociatedTokenAddress(
      rewardsMintSell,
      Signer.publicKey
    );

    const buyerTokenAccount = await getAssociatedTokenAddress(
      rewardsMintBuy,
      Signer.publicKey
    );

    const [defaultVestingSchedule] = await get_pda_from_seeds(
      [
        Buffer.from('isGodReal?'),
        Buffer.from('DoULoveMe?'),
        Buffer.from('SweetChick'),
      ],
      program
    );

    const { numberOfSchedules, perVestingAmount } =
      await program.account.defaultVestingSchedule.fetch(
        defaultVestingSchedule
      );

    //checks
    //tokenSupply(modified)=tokenSupply(actual)-(number_of_schedules*per_vesting_amount)
    // fill this in both calc param of tokenSupply
    const sellTokenInfo = await fetchTokenMetadata(rewardsMintSell.toString());
    const sellSupplyActual = new BN(sellTokenInfo.supply.toString());
    const sellSupplyModified = sellSupplyActual.sub(
      perVestingAmount.muln(numberOfSchedules)
    );
    const valueSell = calculateSellAmount(
      sellSupplyModified.div(new BN(10).pow(new BN(sellTokenInfo.decimals))),
      amountSell.div(new BN(10).pow(new BN(sellTokenInfo.decimals)))
    );

    const buyTokenInfo = await fetchTokenMetadata(rewardsMintBuy.toString());
    const buySupplyActual = new BN(buyTokenInfo.supply.toString());
    const buySupplyModified = buySupplyActual.sub(
      perVestingAmount.muln(numberOfSchedules)
    );

    const valueBuy = calculateBuyAmount(
      buySupplyModified.div(new BN(10).pow(new BN(buyTokenInfo.decimals))),
      amountBuy.div(new BN(10).pow(new BN(buyTokenInfo.decimals)))
    );

    const ixBuyTokens = await program.methods
      .buyTokens(valueBuy, amountBuy)
      .accounts({
        buyer: Signer.publicKey,
        communalDeposit: communal_account_buy,
        communalTokenAccount: communalTokenBuyAccount,
        rewardsMint: rewardsMintBuy,
        tokenProgram: TOKEN_PROGRAM_ID,
        repositoryAccount: repositoryAccountBuy,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        buyerTokenAccount,
        defaultSchedule: defaultVestingSchedule,
        communalUsdcAccount,
        buyerUsdcAccount: UserUsdcAccount,
        usdcMint,
      })
      .instruction();

    await program.methods
      .sellTokens(valueSell, amountSell)
      .accounts({
        seller: Signer.publicKey,
        communalDeposit: communal_account_sell,
        communalTokenAccount: communalTokenSellAccount,
        rewardsMint: rewardsMintSell,
        tokenProgram: TOKEN_PROGRAM_ID,
        repositoryAccount: repositoryAccountSell,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        sellerTokenAccount,
        defaultSchedule: defaultVestingSchedule,
        communalUsdcAccount,
        sellerUsdcAccount: UserUsdcAccount,
        usdcMint,
      })
      .postInstructions([ixBuyTokens])
      .rpc({ skipPreflight: false, maxRetries: 3 })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
