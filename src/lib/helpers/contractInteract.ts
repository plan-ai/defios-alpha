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
import { clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js';
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

//change
const nameRouterAccount = new PublicKey(
  'DMdqFYVfw9Yn6X2BDB12Gce55KXZUX8NacHqcnvn14wq'
);
const routerCreator = new PublicKey(
  'Au5UxjuuLLD9AQuE4QWQ1ucUqKPjaXQ8EkSBokUPCiB6'
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

export const get_pda_from_seeds = async (seeds: any, program: any) => {
  return await web3.PublicKey.findProgramAddressSync(seeds, program.programId);
};

export const createRepository = (
  repositoryCreator: PublicKey,
  repoName: string,
  repoLink: string,
  tokenName: string,
  tokenImage: string,
  tokenMetadata: string,
  repositoryVerifiedUser: PublicKey
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
      const [mintKeypair] = await get_pda_from_seeds(
        [
          Buffer.from('Miners'),
          Buffer.from('MinerC'),
          repositoryAccount.toBuffer(),
        ],
        program
      );
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
          tokenImage,
          tokenMetadata
        )
        .accounts({
          nameRouterAccount,
          repositoryAccount,
          repositoryCreatorTokenAccount,
          repositoryCreator: repositoryCreator,
          repositoryVerifiedUser: repositoryVerifiedUser,
          rewardsMint: mintKeypair,
          routerCreator: routerCreator,
          systemProgram: web3.SystemProgram.programId,
          vestingAccount: vestingAccount,
          vestingTokenAccount: vestingTokenAccount,
          defaultSchedule: defaultVestingSchedule,
        })
        .rpc({ skipPreflight: true })
        .then(() => {
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
  repositoryVerifiedUser: PublicKey
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
          nameRouterAccount,
          repositoryAccount,
          repositoryCreatorTokenAccount: null,
          repositoryCreator: repositoryCreator,
          repositoryVerifiedUser: repositoryVerifiedUser,
          rewardsMint: null,
          routerCreator: routerCreator,
          systemProgram: web3.SystemProgram.programId,
          vestingAccount: null,
          vestingTokenAccount: null,
          defaultSchedule: defaultVestingSchedule,
        })
        .rpc({ skipPreflight: true })
        .then(() => {
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
  issueVerifiedUser: PublicKey
) => {
  return new Promise<PublicKey>(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const { repositoryCreator } = await program.account.repository.fetch(
      repositoryAccount
    );

    const uriSplit = issueURI.split('/');
    const issueIndex = uriSplit[uriSplit.length - 1];

    const [issueAccount] = await get_pda_from_seeds(
      [
        Buffer.from('issue'),
        Buffer.from(issueIndex.toString()),
        repositoryAccount.toBuffer(),
        issueCreator.toBuffer(),
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
    const issueTokenPoolAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueAccount,
      true
    );

    program.methods
      .addIssue(issueURI)
      .accounts({
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        issueAccount,
        issueCreator: issueCreator,
        issueTokenPoolAccount,
        issueVerifiedUser,
        nameRouterAccount,
        repositoryAccount,
        rewardsMint: mintKeypair,
        routerCreator: routerCreator,
        repositoryCreator: repositoryCreator,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ skipPreflight: true })
      .then((res) => {
        resolve(issueAccount);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const stakeIssue = (
  issueStaker: PublicKey,
  issueAccount: PublicKey,
  amount: number
) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const { repository } = await program.account.issue.fetch(issueAccount);

    const [issueStakerAccount] = await get_pda_from_seeds(
      [
        Buffer.from('issuestaker'),
        issueAccount.toBuffer(),
        issueStaker.toBuffer(),
      ],
      program
    );

    const [mintKeypair] = await get_pda_from_seeds(
      [Buffer.from('Miners'), Buffer.from('MinerC'), repository.toBuffer()],
      program
    );

    const issueStakerTokenAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueStaker
    );

    const issueTokenPoolAccount = await getAssociatedTokenAddress(
      mintKeypair,
      issueAccount,
      true
    );

    const transferAmount = amount * 10 ** 9;
    console.log('transferAmount: ' + transferAmount);

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
      .rpc({ skipPreflight: true })
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
  issueAccount: PublicKey
) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);

    const { repository } = await program.account.issue.fetch(issueAccount);

    const [issueStakerAccount] = await get_pda_from_seeds(
      [
        Buffer.from('issuestaker'),
        issueAccount.toBuffer(),
        issueStaker.toBuffer(),
      ],
      program
    );

    const [mintKeypair] = await get_pda_from_seeds(
      [Buffer.from('Miners'), Buffer.from('MinerC'), repository.toBuffer()],
      program
    );

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
      .rpc({ skipPreflight: true })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const addCommit = (
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
    const { repository, issueCreator } = await program.account.issue.fetch(
      issueAccount
    );
    const { repositoryCreator } = await program.account.repository.fetch(
      repository
    );
    const [commitAccount] = await get_pda_from_seeds(
      [
        Buffer.from('commit'),
        Buffer.from(commitHash),
        commitCreator.toBuffer(),
        issueAccount.toBuffer(),
      ],
      program
    );

    program.methods
      .addCommit(commitHash, treeHash, metadataURI)
      .accounts({
        commitAccount,
        commitCreator: commitCreator,
        commitVerifiedUser,
        issueAccount,
        issueCreator,
        nameRouterAccount,
        repositoryCreator,
        repositoryAccount: repository,
        routerCreator: routerCreator,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc({ skipPreflight: true })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const addPr = (
  commitCreator: PublicKey,
  issueAccount: PublicKey,
  commitVerifiedUser: PublicKey,
  commitHashUnsliced: string,
  metadataURI: string
) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer);
    const program = await getDefiOsProgram(provider);
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

    const [mintKeypair] = await get_pda_from_seeds(
      [Buffer.from('Miners'), Buffer.from('MinerC'), repository.toBuffer()],
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

    const pullRequestTokenAccount = await getAssociatedTokenAddress(
      mintKeypair,
      pullRequestMetadataAccount,
      true
    );

    program.methods
      .addPr(metadataURI)
      .accounts({
        pullRequestVerifiedUser: commitVerifiedUser,
        issue: issueAccount,
        commit: commitAccount,
        pullRequestMetadataAccount: pullRequestMetadataAccount,
        nameRouterAccount,
        pullRequestTokenAccount,
        pullRequestAddr: commitCreator,
        routerCreator: routerCreator,
        systemProgram: web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rewardsMint: mintKeypair,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ skipPreflight: true })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const stakePr = (
  prStaker: PublicKey,
  prAccount: PublicKey,
  amount: number
) => {
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

    const [mintKeypair] = await get_pda_from_seeds(
      [Buffer.from('Miners'), Buffer.from('MinerC'), repository.toBuffer()],
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

    const pullRequestTokenAccount = await getAssociatedTokenAddress(
      mintKeypair,
      pullRequestMetadataAccount,
      true
    );

    const pullRequestStakerTokenAccount = await getAssociatedTokenAddress(
      mintKeypair,
      Signer.publicKey
    );

    const [pullRequestStakerAccount] = await get_pda_from_seeds(
      [
        Buffer.from('pullrestaker'),
        pullRequestMetadataAccount.toBuffer(),
        prStaker.toBuffer(),
      ],
      program
    );

    const transferAmount = amount * 10 ** 9;
    console.log('transferAmount: ' + transferAmount);

    program.methods
      .stakePr(new BN(transferAmount))
      .accounts({
        pullRequestAddr,
        issue: issueAccount,
        pullRequestMetadataAccount: pullRequestMetadataAccount,
        nameRouterAccount,
        pullRequestVerifiedUser: pullRequestAddr,
        pullRequestTokenAccount,
        routerCreator: routerCreator,
        systemProgram: web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rewardsMint: mintKeypair,
        tokenProgram: TOKEN_PROGRAM_ID,
        pullRequestStaker: prStaker,
        pullRequestStakerTokenAccount,
        pullRequestStakerAccount,
      })
      .rpc({ skipPreflight: true })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const unstakePr = (prStaker: PublicKey, prAccount: PublicKey) => {
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

    const [mintKeypair] = await get_pda_from_seeds(
      [Buffer.from('Miners'), Buffer.from('MinerC'), repository.toBuffer()],
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

    const pullRequestTokenAccount = await getAssociatedTokenAddress(
      mintKeypair,
      pullRequestMetadataAccount,
      true
    );

    const pullRequestStakerTokenAccount = await getAssociatedTokenAddress(
      mintKeypair,
      Signer.publicKey
    );

    const [pullRequestStakerAccount] = await get_pda_from_seeds(
      [
        Buffer.from('pullrestaker'),
        pullRequestMetadataAccount.toBuffer(),
        prStaker.toBuffer(),
      ],
      program
    );

    program.methods
      .unstakePr()
      .accounts({
        pullRequestAddr,
        issue: issueAccount,
        pullRequestMetadataAccount: pullRequestMetadataAccount,
        nameRouterAccount,
        pullRequestVerifiedUser: pullRequestAddr,
        pullRequestTokenAccount,
        routerCreator: routerCreator,
        systemProgram: web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rewardsMint: mintKeypair,
        tokenProgram: TOKEN_PROGRAM_ID,
        pullRequestStaker: prStaker,
        pullRequestStakerTokenAccount,
        pullRequestStakerAccount,
      })
      .rpc({ skipPreflight: true })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const acceptPr = (
  verifiedUserAccount: PublicKey,
  prAccount: PublicKey
) => {
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
    const { repositoryCreator, name } = await program.account.repository.fetch(
      repository
    );

    const [pullRequestMetadataAccount] = await get_pda_from_seeds(
      [
        Buffer.from('pullrequestadded'),
        issueAccount.toBuffer(),
        commitCreator.toBuffer(),
      ],
      program
    );

    program.methods
      .acceptPr(name)
      .accounts({
        nameRouterAccount,
        repositoryVerifiedUser: verifiedUserAccount,
        pullRequestAddr,
        pullRequestVerifiedUser: pullRequestAddr,
        pullRequestMetadataAccount,
        repositoryCreator,
        repositoryAccount: repository,
        issue: issueAccount,
        routerCreator: routerCreator,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc({ skipPreflight: true })
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
  verifiedUserAccount: PublicKey
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(Connection, Signer);
      const program = await getDefiOsProgram(provider);

      const { name, repositoryCreator } =
        await program.account.repository.fetch(repositoryAccount);

      const [mintKeypair] = await get_pda_from_seeds(
        [
          Buffer.from('Miners'),
          Buffer.from('MinerC'),
          repositoryAccount.toBuffer(),
        ],
        program
      );
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
        .unlockTokens(name)
        .accounts({
          nameRouterAccount,
          repositoryAccount,
          repositoryCreatorTokenAccount,
          repositoryCreator,
          repositoryVerifiedUser: verifiedUserAccount,
          routerCreator: routerCreator,
          systemProgram: web3.SystemProgram.programId,
          vestingAccount: vestingAccount,
          tokenMint: mintKeypair,
          vestingTokenAccount: vestingTokenAccount,
        })
        .rpc({ skipPreflight: true })
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

export const claimReward = (verifiedUserAccount: PublicKey, prAccount: PublicKey) => {
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
    const { repository, issueTokenPoolAccount, issueCreator } =
      await program.account.issue.fetch(issueAccount);

    const { repositoryCreator } = await program.account.repository.fetch(
      repository
    );

    const [mintKeypair] = await get_pda_from_seeds(
      [Buffer.from('Miners'), Buffer.from('MinerC'), repository.toBuffer()],
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

    const pullRequestTokenAccount = await getAssociatedTokenAddress(
      mintKeypair,
      pullRequestMetadataAccount,
      true
    );

    program.methods
      .claimReward()
      .accounts({
        nameRouterAccount,
        pullRequestCreator: pullRequestAddr,
        pullRequestVerifiedUser: verifiedUserAccount,
        pullRequest: pullRequestMetadataAccount,
        pullRequestCreatorRewardAccount: Signer,
        repositoryCreator: repositoryCreator,
        rewardsMint: mintKeypair,
        repositoryAccount: repository,
        issueAccount: issueAccount,
        issueTokenPoolAccount,
        issueCreator: issueCreator,
        routerCreator: routerCreator,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        pullRequestTokenAccount: pullRequestTokenAccount,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc({ skipPreflight: true })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};