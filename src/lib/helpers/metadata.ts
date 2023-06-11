import axios from '@/lib/axiosClient';
const jwt = process.env.IPFS_JWT as string;
import { Metaplex } from '@metaplex-foundation/js';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';

export const uploadFileToIPFS = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const resFile = await axios({
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
    data: formData,
    headers: {
      // Authorization: `Bearer ${jwt}`,
      pinata_api_key: 'b72b90653dbea5420f6b',
      pinata_secret_api_key:
        '84756bad08381666878067891d9d3e6d427ae5be8d278715b55776ac63d5881e',
      'Content-Type': 'multipart/form-data',
    },
  });
  return resFile.data.IpfsHash;
};

export const uploadMetadataToIPFS = async (metadata: any) => {
  const res = await axios({
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: {
      // Authorization: `Bearer ${jwt}`,
      pinata_api_key: 'b72b90653dbea5420f6b',
      pinata_secret_api_key:
        '84756bad08381666878067891d9d3e6d427ae5be8d278715b55776ac63d5881e',
      'Content-Type': 'application/json',
    },
    data: metadata,
  });
  return res.data.IpfsHash;
};

export const fetchTokenMetadata = async (tokenID: string) => {
  const connection = new Connection(clusterApiUrl('devnet'));
  const metaplex = new Metaplex(connection);
  const mintAddress = new PublicKey(tokenID);
  const nft = await metaplex.nfts().findByMint({ mintAddress });
  const mintInfo = await getMint(connection, mintAddress);
  return {
    ...nft,
    ...mintInfo,
  };
};

export const fetchDecimals = async (tokenID: string) => {
  const connection = new Connection(clusterApiUrl('devnet'));
  const mintAddress = new PublicKey(tokenID);
  const mintInfo = await getMint(connection, mintAddress);
  return mintInfo.decimals;
};
