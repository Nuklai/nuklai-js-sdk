import { PublicKey, SecretKey, Signature } from '../crypto/ed25519';
import { Address } from '../utils/address';
import { Auth, AuthFactory } from './auth';
export declare const Ed25519AuthSize: number;
export declare class ED25519 implements Auth {
    signer: PublicKey;
    signature: Signature;
    private addr;
    constructor(signer: PublicKey, signature: Signature);
    address(): Address;
    getTypeId(): number;
    verify(message: Uint8Array): Promise<boolean>;
    actor(): Address;
    sponsor(): Address;
    size(): number;
    toBytes(): Uint8Array;
    static fromBytes(bytes: Uint8Array): [ED25519, Error?];
    static publicKeyToHex(publicKey: PublicKey): string;
    static hexToPublicKey(hex: string): PublicKey;
}
export declare class ED25519Factory implements AuthFactory {
    privateKey: SecretKey;
    constructor(privateKey?: SecretKey);
    sign(message: Uint8Array): Auth;
    computeUnits(): number;
    bandwidth(): number;
    static generateKeyPair(): {
        privateKey: SecretKey;
        publicKey: PublicKey;
    };
    static publicKeyFromPrivateKey(privateKey: SecretKey): PublicKey;
    static privateKeyToHex(privateKey: SecretKey): string;
    static hexToPrivateKey(hex: string): SecretKey;
}
