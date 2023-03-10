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
import { clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js';
import { DefiOsIDL } from '../../types/idl/defios';
import { TokenVestingIDL } from '../../types/idl/token_vesting';
import * as mpl from "@metaplex-foundation/mpl-token-metadata"
import { Metaplex, keypairIdentity, bundlrStorage, compareAmounts, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Signer, Connection } from './wallet';
import { uploadFileToIPFS, uploadMetadataToIPFS } from './metadata';
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

const nameRouterAccount = new PublicKey("8kMWVDtNrGDwVcv57FFS64VmLdBjaqwV4FjR8EUKvojz")
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

export const createRepository = (repositoryVerifiedUser: PublicKey, image: File, tokenName: string, tokenSymbol: string, repoName: string, repoLink: string, mintAmount: number) => {
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

      const res = await program.methods
        .createRepository(
          repoName,
          'Open source revolution',
          repoLink,
          [],
          []
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
          mintTokensIx
        ])
        .rpc();

      console.log(res)
      resolve(repositoryAccount)
    }
    catch (e) {
      reject(e)
    }
  })
}