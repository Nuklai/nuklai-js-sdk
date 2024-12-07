import { PrivateKeySigner, EphemeralSigner } from 'hypersdk-client/dist/PrivateKeySigner';
import { SignerIface } from 'hypersdk-client/dist/types';
import { addressBytesFromPubKey, addressHexFromPubKey } from 'hypersdk-client/dist/Marshaler';
import { ed25519 } from '@noble/curves/ed25519';
import { bytesToHex } from '@noble/hashes/utils';
import { hexToBytes } from "@noble/curves/abstract/utils";

export class NuklaiWallet {
    private signer: SignerIface;

    constructor(privateKey?: Uint8Array) {
        if (privateKey) {
            this.signer = new PrivateKeySigner(privateKey);
        } else {
          this.signer = new EphemeralSigner();
        }
    }

    public getAddress(): string {
        const pubKey = this.signer.getPublicKey();
        return addressHexFromPubKey(pubKey);
    }

    public getAddressBytes(): Uint8Array {
        const pubKey = this.signer.getPublicKey();
        return addressBytesFromPubKey(pubKey);
    }

    public getPublicKey(): string {
        return bytesToHex(this.signer.getPublicKey());
    }

    public getSigner(): SignerIface {
        return this.signer;
    }

    public static createRandom(): NuklaiWallet {
        return new NuklaiWallet(ed25519.utils.randomPrivateKey());
    }

    /**
     * Create a wallet from a private key
     * @param privateKeyHex - Private key in hex format
     */
    public static fromPrivateKey(privateKeyHex: string): NuklaiWallet {
        const privateKeyBytes = hexToBytes(privateKeyHex);
        return new NuklaiWallet(privateKeyBytes);
    }

    /**
     * Create a wallet from a seed phrase (mnemonic)
     * @param mnemonic - 12 or 24 word seed phrase
     * @param path - HD wallet derivation path
     */
    public static async fromMnemonic(mnemonic: string, path: string = "m/44'/9000'/0'/0/0"): Promise<NuklaiWallet> {
        // TODO: Write the actual BIP39 implementation
        throw new Error("Mnemonic support not yet implemented");
    }
}