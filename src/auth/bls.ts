import { bls, utils } from "@avalabs/avalanchejs";
import { bls12_381 } from "@noble/curves/bls12-381";
import { randomBytes } from "@noble/hashes/utils";
import { BLS_COMPUTE_UNITS, BLS_ID, HRP } from "../constants/nuklaivm";
import { Codec } from "../utils/codec";
import { Auth, AuthFactory } from "./auth";
import { ADDRESS_LEN } from "../constants/consts";

export const BlsAuthSize = bls.PUBLIC_KEY_LENGTH + bls.SIGNATURE_LENGTH;

export class BLS implements Auth {
  public signer: bls.PublicKey;
  public signature: bls.Signature;
  private addr: Uint8Array;

  constructor(signer: bls.PublicKey, signature: bls.Signature) {
    this.signer = signer;
    this.signature = signature;
    this.addr = NewBLSAddress(this.signer);
  }

  getTypeId(): number {
    return BLS_ID;
  }

  async verify(message: Uint8Array): Promise<boolean> {
    return bls.verify(this.signer, this.signature, message);
  }

  actor(): Uint8Array {
    return this.addr;
  }

  sponsor(): Uint8Array {
    return this.addr;
  }

  size(): number {
    return BlsAuthSize;
  }

  toBytes(): Uint8Array {
    const size = this.size();
    const codec = Codec.newWriter(size, size);
    const signerBytes = bls.publicKeyToBytes(this.signer);
    codec.packFixedBytes(signerBytes);
    const signatureBytes = bls.signatureToBytes(this.signature);
    codec.packFixedBytes(signatureBytes);
    return codec.toBytes();
  }

  static fromBytes(bytes: Uint8Array): BLS {
    const codec = Codec.newReader(bytes, bytes.length);
    const signer = bls.publicKeyFromBytes(
      codec.unpackFixedBytes(bls.PUBLIC_KEY_LENGTH)
    );
    const signature = bls.signatureFromBytes(
      codec.unpackFixedBytes(bls.SIGNATURE_LENGTH)
    );
    return new BLS(signer, signature);
  }
}

export class BLSFactory implements AuthFactory {
  privateKey: bls.SecretKey;

  constructor(privateKey: bls.SecretKey) {
    this.privateKey = privateKey;
  }

  sign(message: Uint8Array): Auth {
    const signer = GetPublicKeyFromPrivateKey(this.privateKey);
    const signature = bls.sign(message, this.privateKey);
    return new BLS(signer, bls.signatureFromBytes(signature));
  }

  computeUnits(): number {
    return BLS_COMPUTE_UNITS;
  }

  bandwidth(): number {
    return bls.PUBLIC_KEY_LENGTH + bls.SIGNATURE_LENGTH;
  }
}

export function NewBLSAddress(publicKey: bls.PublicKey): Uint8Array {
  const address = new Uint8Array(ADDRESS_LEN);
  address[0] = BLS_ID;
  address.set(bls.publicKeyToBytes(publicKey).slice(1, ADDRESS_LEN), 1);
  return address;
}

export async function GenerateRandomPrivateKey(): Promise<bls.SecretKey> {
  return bls.secretKeyFromBytes(randomBytes(32)); // 32 bytes for a private key
}

export function GetPublicKeyFromPrivateKey(
  secretKey: bls.SecretKey
): bls.PublicKey {
  const publicKeyBytes = bls12_381.getPublicKey(secretKey);
  return bls.publicKeyFromBytes(publicKeyBytes);
}

export async function GenerateKeyPair(): Promise<{
  privateKey: bls.SecretKey;
  publicKey: bls.PublicKey;
}> {
  const privateKey = await GenerateRandomPrivateKey();
  const publicKey = GetPublicKeyFromPrivateKey(privateKey);
  return { privateKey, publicKey };
}

export function secretKeyToHex(secretKey: bls.SecretKey): string {
  return Buffer.from(bls.secretKeyToBytes(secretKey)).toString("hex");
}

export function hexToSecretKey(hex: string): bls.SecretKey {
  return bls.secretKeyFromBytes(Buffer.from(hex, "hex"));
}

export function publicKeyToHex(publicKey: bls.PublicKey): string {
  return Buffer.from(bls.publicKeyToBytes(publicKey)).toString("hex");
}

export function hexToPublicKey(hex: string): bls.PublicKey {
  return bls.publicKeyFromBytes(Buffer.from(hex, "hex"));
}

export function formatAddress(address: Uint8Array): string {
  return utils.formatBech32(HRP, address);
}

export function parseAddress(address: string): Uint8Array {
  return utils.parseBech32(address)[1];
}
