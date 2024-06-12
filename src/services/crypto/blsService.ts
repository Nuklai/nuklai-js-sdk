import { randomBytes } from "@noble/hashes/utils";
import { bls12_381 } from "@noble/curves/bls12-381";
import { bls, utils } from "@avalabs/avalanchejs";
import { ADDRESS_LEN, BLS_ID, HRP } from "../../constants/nuklaivm";

export class BLSService {
  static async generatePrivateKey(): Promise<bls.SecretKey> {
    return bls.secretKeyFromBytes(randomBytes(32)); // 32 bytes for a private key
  }

  static getPublicKey(secretKey: bls.SecretKey): bls.PublicKey {
    const publicKeyBytes = bls12_381.getPublicKey(secretKey);
    return bls.publicKeyFromBytes(publicKeyBytes);
  }

  static async generateKeyPair(): Promise<{
    privateKey: bls.SecretKey;
    publicKey: bls.PublicKey;
  }> {
    const privateKey = await BLSService.generatePrivateKey();
    const publicKey = BLSService.getPublicKey(privateKey);
    return { privateKey, publicKey };
  }

  static secretKeyToHex(secretKey: bls.SecretKey): string {
    return Buffer.from(bls.secretKeyToBytes(secretKey)).toString("hex");
  }

  static hexToSecretKey(hex: string): bls.SecretKey {
    return bls.secretKeyFromBytes(Buffer.from(hex, "hex"));
  }

  static publicKeyToHex(publicKey: bls.PublicKey): string {
    return Buffer.from(bls.publicKeyToBytes(publicKey)).toString("hex");
  }

  static hexToPublicKey(hex: string): bls.PublicKey {
    return bls.publicKeyFromBytes(Buffer.from(hex, "hex"));
  }

  static sign(message: Uint8Array, privateKey: bls.SecretKey): Uint8Array {
    return bls.sign(message, privateKey);
  }

  static verify(
    message: Uint8Array,
    publicKey: bls.PublicKey,
    signature: Uint8Array
  ): boolean {
    const sig = bls.signatureFromBytes(signature);
    return bls.verify(publicKey, sig, message);
  }

  static generateAddress(publicKey: bls.PublicKey): string {
    const address = new Uint8Array(ADDRESS_LEN);
    address[0] = BLS_ID;
    address.set(bls.publicKeyToBytes(publicKey).slice(1, ADDRESS_LEN), 1);

    return utils.formatBech32(HRP, address);
  }

  static parseAddress(address: string): Uint8Array {
    return utils.parseBech32(address)[1];
  }
}
