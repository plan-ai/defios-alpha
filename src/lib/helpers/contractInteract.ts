import { contractAddresses } from '@/config/addresses';
import { Defios, IDL } from '../../types/defios';
import { TokenVesting } from '@/types/token_vesting';
import {
  Program,
  AnchorProvider,
  web3,
  Wallet,
  Idl,
  BN,
} from '@project-serum/anchor';
import { clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js';
import { TokenVestingIDL } from '../../types/idl/token_vesting';
import * as mpl from "@metaplex-foundation/mpl-token-metadata"
import { Metaplex, keypairIdentity, bundlrStorage, compareAmounts, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Signer, Connection } from './wallet';
import { fetchTokenMetadata, uploadFileToIPFS, uploadMetadataToIPFS } from './metadata';
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
import sha1 from 'sha1';
import { rectToBox } from 'reactflow';

const nameRouterAccount = new PublicKey("zNjz5kM2GTgAbYuoQ576D9QKEp2D4xTB3khVH57rWLr")
const routerCreator = new PublicKey("Au5UxjuuLLD9AQuE4QWQ1ucUqKPjaXQ8EkSBokUPCiB6")

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

export const getTokenVestingProgram = async (provider: AnchorProvider) => {
  const program: Program<TokenVesting> = new Program(
    TokenVestingIDL,
    contractAddresses.tokenVesting,
    provider
  );
  return program;
};

export const createRepositoryImported = (repositoryVerifiedUser: PublicKey, tokenAddress: PublicKey, tokenName: string, tokenSymbol: string, repoName: string, repoLink: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(Connection, Signer)
      const program = await getDefiOsProgram(provider)

      const [repositoryAccount] = await web3.PublicKey.findProgramAddress(
        [
          Buffer.from('repository'),
          Buffer.from(repoName),
          Signer.publicKey.toBuffer(),
        ],
        program.programId
      );
      const repositoryTokenPoolAccount = await getAssociatedTokenAddress(
        tokenAddress,
        repositoryAccount,
        true
      );

      const createAssociatedTokenIx = createAssociatedTokenAccountInstruction(
        Signer.publicKey,
        repositoryTokenPoolAccount,
        repositoryAccount,
        tokenAddress
      );

      let usernames: Array<string> = []
      let amounts: Array<BN> = []

      const tokenInfo = await fetchTokenMetadata(tokenAddress.toBase58())
      program.methods
        .createRepository(
          repoName,
          'Open source revolution',
          repoLink,
          usernames,
          amounts,
          tokenName,
          tokenSymbol,
          tokenInfo.uri
        )
        .accounts({
          nameRouterAccount,
          repositoryAccount,
          repositoryCreator: Signer.publicKey,
          repositoryVerifiedUser: repositoryVerifiedUser,
          rewardsMint: tokenAddress,
          routerCreator: routerCreator,
          systemProgram: web3.SystemProgram.programId,
          repositoryTokenPoolAccount
        })
        .preInstructions([
          createAssociatedTokenIx,
        ])
        .rpc({ skipPreflight: true })
        .then(() => {
          resolve(repositoryAccount)
        })
        .catch((e) => {
          reject(e)
        })
    }
    catch (e) {
      reject(e)
    }
  })
}

export const createRepository = (repositoryVerifiedUser: PublicKey, image: File, tokenName: string, tokenSymbol: string, repoName: string, repoLink: string, mintAmount: number, owners: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(Connection, Signer)
      const program = await getDefiOsProgram(provider)
      const metaplex = Metaplex.make(Connection)
        .use(walletAdapterIdentity(Signer))
        .use(bundlrStorage());

      const mintKeypair = Keypair.generate()
      await metaplex.tokens().createMint({
        mint: mintKeypair,
        mintAuthority: Signer.publicKey,
        decimals: 9
      })
      const metadataPDA = metaplex.nfts().pdas().metadata({
        mint: mintKeypair.publicKey,
      })
      const accounts = {
        metadata: metadataPDA,
        mintKeypair,
        mintAuthority: Signer.publicKey,
        payer: Signer.publicKey,
        updateAuthority: Signer.publicKey,
      }
      const imageCID = await uploadFileToIPFS(image)
      const metadataCID = await uploadMetadataToIPFS({
        name: tokenName,
        symbol: tokenSymbol,
        image: `https://gateway.pinata.cloud/ipfs/${imageCID}`
      })
      const dataV2 = {
        name: tokenName,
        symbol: tokenSymbol,
        uri: `https://gateway.pinata.cloud/ipfs/${metadataCID}`,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null
      }
      let ix;
      const args = {
        createMetadataAccountArgsV2: {
          data: dataV2,
          isMutable: true
        }
      };

      ix = mpl.createCreateMetadataAccountV2Instruction({
        metadata: accounts.metadata,
        mint: accounts.mintKeypair.publicKey,
        mintAuthority: accounts.mintAuthority,
        payer: accounts.payer,
        updateAuthority: accounts.updateAuthority,
      }, args);

      const [repositoryAccount] = await web3.PublicKey.findProgramAddress(
        [
          Buffer.from('repository'),
          Buffer.from(repoName),
          Signer.publicKey.toBuffer(),
        ],
        program.programId
      );
      const repositoryTokenPoolAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        repositoryAccount,
        true
      );

      const createAssociatedTokenIx = createAssociatedTokenAccountInstruction(
        Signer.publicKey,
        repositoryTokenPoolAccount,
        repositoryAccount,
        mintKeypair.publicKey
      );

      const mintTokensIx = createMintToCheckedInstruction(
        mintKeypair.publicKey,
        repositoryTokenPoolAccount,
        Signer.publicKey,
        mintAmount * 10 ** 9,
        9,
        []
      );

      const selfTokenAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        new PublicKey('9HhPBSikrvS1J6e8uDWUQgJ4VMXrcPyq3qhcENBqSoTg'),
      );

      const createAssociatedTokenIx2 = createAssociatedTokenAccountInstruction(
        Signer.publicKey,
        selfTokenAccount,
        new PublicKey('9HhPBSikrvS1J6e8uDWUQgJ4VMXrcPyq3qhcENBqSoTg'),
        mintKeypair.publicKey
      );

      const mintTokensIx2 = createMintToCheckedInstruction(
        mintKeypair.publicKey,
        selfTokenAccount,
        Signer.publicKey,
        20000 * 10 ** 9,
        9,
        []
      );

      let usernames: Array<string> = []
      let amounts: Array<BN> = []
      Object.keys(owners).forEach((key) => {
        usernames.push(key)
        let percentageString = owners[key].replace('%', '')
        let percentage = parseFloat(percentageString)
        let amount = (percentage / 100) * mintAmount
        amounts.push(new BN(amount * 10 ** 9))
      })
      console.log(owners, usernames, amounts)

      program.methods
        .createRepository(
          repoName,
          'Open source revolution',
          repoLink,
          usernames,
          amounts,
          tokenName,
          tokenSymbol,
          `https://gateway.pinata.cloud/ipfs/${metadataCID}`
        )
        .accounts({
          nameRouterAccount,
          repositoryAccount,
          repositoryCreator: Signer.publicKey,
          repositoryVerifiedUser: repositoryVerifiedUser,
          rewardsMint: mintKeypair.publicKey,
          routerCreator: routerCreator,
          systemProgram: web3.SystemProgram.programId,
          repositoryTokenPoolAccount
        })
        .preInstructions([
          ix,
          createAssociatedTokenIx,
          createAssociatedTokenIx2,
          mintTokensIx,
          mintTokensIx2
        ])
        .rpc({ skipPreflight: true })
        .then(() => {
          resolve(repositoryAccount)
        })
        .catch((e) => {
          reject(e)
        })
    }
    catch (e) {
      reject(e)
    }
  })
}

export const createIssue = (issueCreator: PublicKey, issueURI: string, repositoryAccount: PublicKey, issueVerifiedUser: PublicKey) => {
  return new Promise<PublicKey>(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer)
    const program = await getDefiOsProgram(provider)
    const { issueIndex, repositoryCreator, rewardsMint } = await program.account.repository.fetch(
      repositoryAccount
    );
    console.log('issueIndex', repositoryCreator)
    const [issueAccount] = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from('issue'),
        Buffer.from(issueIndex.toString()),
        repositoryAccount.toBuffer(),
        issueCreator.toBuffer(),
      ],
      program.programId
    );

    console.log('issueAccount', issueAccount.toBase58())
    const issueTokenPoolAccount = await getAssociatedTokenAddress(
      rewardsMint,
      issueAccount,
      true
    );
    console.log('issueTokenPoolAccount', issueTokenPoolAccount.toBase58())
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
        rewardsMint: rewardsMint,
        routerCreator: routerCreator,
        repositoryCreator: repositoryCreator,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ skipPreflight: true })
      .then((res) => {
        resolve(issueAccount)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export const stakeIssue = (issueStaker: PublicKey, issueAccount: PublicKey, amount: number) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer)
    const program = await getDefiOsProgram(provider)
    const { repository } = await program.account.issue.fetch(issueAccount);
    const { rewardsMint } = await program.account.repository.fetch(repository);

    const transferAmount = amount * 10 ** 9;
    const issueStakerTokenAccount = await getAssociatedTokenAddress(
      rewardsMint,
      issueStaker
    );

    const createIssueStakerTokenAccountIx =
      createAssociatedTokenAccountInstruction(
        issueStaker,
        issueStakerTokenAccount,
        issueStaker,
        rewardsMint
      );

    const [issueStakerAccount] = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from('issuestaker'),
        issueAccount.toBuffer(),
        issueStaker.toBuffer(),
      ],
      program.programId
    );

    const issueTokenPoolAccount = await getAssociatedTokenAddress(
      rewardsMint,
      issueAccount,
      true
    );

    program.methods
      .stakeIssue(new BN(transferAmount))
      .accounts({
        issueAccount,
        repositoryAccount: repository,
        issueTokenPoolAccount,
        issueStaker: issueStaker,
        issueStakerAccount,
        issueStakerTokenAccount,
        rewardsMint: rewardsMint,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .preInstructions([createIssueStakerTokenAccountIx])
      .rpc({ skipPreflight: true })
      .then((res) => {
        resolve(res)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export const unstakeIssue = (issueStaker: PublicKey, issueAccount: PublicKey, amount: number) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer)
    const program = await getDefiOsProgram(provider)
    const { repository } = await program.account.issue.fetch(issueAccount);
    const { rewardsMint } = await program.account.repository.fetch(repository);

    const [issueStakerAccount] = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from('issuestaker'),
        issueAccount.toBuffer(),
        issueStaker.toBuffer(),
      ],
      program.programId
    );

    const issueTokenPoolAccount = await getAssociatedTokenAddress(
      rewardsMint,
      issueAccount,
      true
    );

    const issueStakerTokenAccount = await getAssociatedTokenAddress(
      rewardsMint,
      issueStaker
    );

    await program.methods
      .unstakeIssue()
      .accounts({
        issueAccount,
        repositoryAccount: repository,
        issueTokenPoolAccount,
        issueStaker: issueStaker,
        issueStakerAccount,
        issueStakerTokenAccount,
        rewardsMint: rewardsMint,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ skipPreflight: true })
      .then((res) => {
        resolve(res)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export const addCommit = (commitCreator: PublicKey, issueAccount: PublicKey, commitVerifiedUser: PublicKey, treeHashUnsliced: string, commitHashUnsliced: string, metadataURI: string) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer)
    const program = await getDefiOsProgram(provider)
    const treeHash = treeHashUnsliced.slice(0, 8);
    const commitHash = commitHashUnsliced.slice(0, 8);
    const { repository, issueCreator } = await program.account.issue.fetch(issueAccount);
    const { repositoryCreator } = await program.account.repository.fetch(repository);
    const [commitAccount] = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from('commit'),
        Buffer.from(commitHash),
        commitCreator.toBuffer(),
        issueAccount.toBuffer(),
      ],
      program.programId
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
        resolve(commitAccount)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export const claimTokens = (username: string, user: PublicKey, verifiedUserAccount: PublicKey, repositoryAccount: PublicKey) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer)
    const program = await getDefiOsProgram(provider)
    const { repositoryCreator, rewardsMint } = await program.account.repository.fetch(
      repositoryAccount
    );
    const repositoryTokenPoolAccount = await getAssociatedTokenAddress(
      rewardsMint,
      repositoryAccount,
      true
    );
    const userRewardTokenAccount = await getAssociatedTokenAddress(
      rewardsMint,
      user
    );
    const [userClaimAccount] = await web3.PublicKey.findProgramAddress(
      [
        Buffer.from("user_claim"),
        Buffer.from(username),
        repositoryAccount.toBuffer(),
        nameRouterAccount.toBuffer()
      ],
      program.programId
    );
    const createUserTokenAccountIx =
    createAssociatedTokenAccountInstruction(
      user,
      userRewardTokenAccount,
      user,
      rewardsMint
    );
    await program.methods.claimUserTokens(username).accounts({
      user: user,
      userRewardTokenAccount: userRewardTokenAccount,
      routerCreator: routerCreator,
      nameRouterAccount: nameRouterAccount,
      userClaimAccount: userClaimAccount,
      repositoryAccount: repositoryAccount,
      repositoryCreator: repositoryCreator,
      repositoryTokenPoolAccount: repositoryTokenPoolAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      verifiedUser: verifiedUserAccount,
      rewardsMint: rewardsMint,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    }).preInstructions([createUserTokenAccountIx])
      .rpc()
      .then((res) => {
        resolve(res)
      })
      .catch((e) => {
        reject(e)
      })
  })

}

export const claimReward = (commitCreator: PublicKey, commitVerifiedUser: PublicKey, issueAccount: PublicKey) => {
  return new Promise(async (resolve, reject) => {
    const provider = await getProvider(Connection, Signer)
    const program = await getDefiOsProgram(provider)
    const { repository, issueCreator } = await program.account.issue.fetch(issueAccount);
    const { rewardsMint, repositoryCreator } = await program.account.repository.fetch(repository);

    const commitCreatorRewardTokenAccount = await getAssociatedTokenAddress(
      rewardsMint,
      commitCreator
    );

    const issueTokenPoolAccount = await getAssociatedTokenAddress(
      rewardsMint,
      issueAccount,
      true
    );

    program.methods
      .claimReward()
      .accounts({
        commitCreatorRewardTokenAccount,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        commitCreator: commitCreator,
        commitVerifiedUser,
        issueAccount,
        rent: web3.SYSVAR_RENT_PUBKEY,
        rewardsMint: rewardsMint,
        repositoryAccount: repository,
        repositoryCreator: repositoryCreator,
        systemProgram: web3.SystemProgram.programId,
        routerCreator: routerCreator,
        tokenProgram: TOKEN_PROGRAM_ID,
        nameRouterAccount,
        issueTokenPoolAccount,
        issueCreator,
        // firstCommitAccount: commitAccounts[0],
        // secondCommitAccount: commitAccounts[1],
        // thirdCommitAccount: commitAccounts[2],
        // fourthCommitAccount: commitAccounts[3],
      })
      .rpc({ skipPreflight: true })
      .then((res) => {
        resolve(res)
      })
      .catch((e) => {
        reject(e)
      })
  })
}