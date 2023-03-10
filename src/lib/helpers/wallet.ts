import { PublicKey } from "@metaplex-foundation/js";
import { web3 } from "@project-serum/anchor";
export let Signer: any
export let Connection: web3.Connection

export const setSigner = (publicKey: PublicKey, signTransaction: any, signAllTransactions: any) => {
    Signer = {
        publicKey: publicKey,
        signTransaction: signTransaction,
        signAllTransactions: signAllTransactions,
    };
}

export const setConnection = (connection: web3.Connection) => {
    Connection = connection
}