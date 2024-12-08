// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { PrivateKeySigner, EphemeralSigner } from 'hypersdk-client/dist/PrivateKeySigner';
import { SignerIface } from 'hypersdk-client/dist/types';
import { addressBytesFromPubKey, addressHexFromPubKey } from 'hypersdk-client/dist/Marshaler';
import { hexToBytes, bytesToHex } from '@noble/hashes/utils';

export class NuklaiWallet {
    private readonly signer: SignerIface;

    constructor(privateKey?: Uint8Array) {
        if (privateKey) {
            if (privateKey.length !== 32) {
                throw new Error('Private key must be 32 bytes');
            }
            this.signer = new PrivateKeySigner(privateKey);
        } else {
            this.signer = new EphemeralSigner();
        }
    }

    public getAddress(): string {
        const pubKey = this.signer.getPublicKey();
        const fullAddress = addressHexFromPubKey(pubKey);
        const cleanAddress = fullAddress.replace('0x', '');
        return cleanAddress.substring(2, 66);
    }

    public getAddressWithPrefix(): string {
        const pubKey = this.signer.getPublicKey();
        const fullAddress = addressHexFromPubKey(pubKey);
        return fullAddress.replace('0x', '').substring(0, 66);
    }

    public getFullAddress(): string {
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

    /**
     * Get the signer interface
     */
    public getSigner(): SignerIface {
        return this.signer;
    }

    /**
     * Create a new wallet with a random private key
     */
    public static createRandom(): NuklaiWallet {
        return new NuklaiWallet();
    }

    /**
     * Create a wallet from a private key
     * @param privateKeyHex - Private key in hex format (with or without '0x' prefix)
     */
    public static fromPrivateKey(privateKeyHex: string): NuklaiWallet {
        const cleanHex = privateKeyHex.replace('0x', '').slice(0, 64);
        const privateKeyBytes = hexToBytes(cleanHex);

        // Make sure we have exactly 32 bytes
        const buffer = new Uint8Array(32);
        buffer.set(privateKeyBytes);
        return new NuklaiWallet(buffer);
    }
}