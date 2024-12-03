import { RpcService } from "./rpcService";
import {
  MAINNET_PUBLIC_API_BASE_URL,
  VM_NAME,
  VM_RPC_PREFIX,
} from "./endpoints";
import { NuklaiVMClient } from "./client";
import {
  AuthType,
  BLS,
  BLSFactory,
  ED25519Factory,
  getAuthFactory,
} from "./auth";
import { Address } from "./utils";
import {formatAddress, formatTxHash} from "./utils/format";
import { ed25519 } from "@noble/curves/ed25519";
import { bls } from "@avalabs/avalanchejs";

export class NuklaiSDK {
  public rpcService: RpcService;
  private client: NuklaiVMClient;

  constructor(baseApiUrl = MAINNET_PUBLIC_API_BASE_URL, privateKey?: string) {
    // Initialize RPC service with proper configuration
    this.rpcService = new RpcService(baseApiUrl);

    // Initialize client with correct VM name and RPC prefix
    this.client = new NuklaiVMClient(baseApiUrl, VM_NAME, VM_RPC_PREFIX);

    if (privateKey) {
      this.setSigner(privateKey);
    }
  }

  // Wallet Management Methods

  private convertToHexAddress(address: string): string {
    try {
      return formatAddress(address);
    } catch (error) {
      throw new Error('Invalid address');
    }
  }

  public formatTxHash(hash: string): string {
    return formatTxHash(hash);
  }

  public formatAddress(address: string): string {
    return formatAddress(address);
  }

  public generateED25519Wallet() {
    const { privateKey, publicKey } = ED25519Factory.generateKeyPair();
    const rawAddress = Address.newAddress(0, publicKey);
    const hexAddress = this.convertToHexAddress(rawAddress.toString());

    return {
      privateKey: ED25519Factory.privateKeyToHex(privateKey),
      publicKey: ED25519Factory.publicKeyToHex(publicKey),
      address: hexAddress
    };
  }

  public generateBLSWallet() {
    const { privateKey, publicKey } = BLSFactory.generateKeyPair();
    const bytes = bls.publicKeyToBytes(publicKey);
    console.log('BLS publicKey bytes:', Buffer.from(bytes).toString('hex'));

    const rawAddress = Address.newAddress(2, bytes);
    console.log('Raw BLS address:', rawAddress.toString());

    const hexAddress = this.convertToHexAddress(rawAddress.toString());
    console.log('Formatted BLS address:', hexAddress);

    return {
      privateKey: BLSFactory.privateKeyToHex(privateKey),
      publicKey: Buffer.from(bytes).toString('hex'),
      address: hexAddress
    };
  }

  public importWallet(privateKey: string, type: AuthType = 'ed25519') {
    const factory = getAuthFactory(type, privateKey);
    if (type === 'ed25519') {
      const decodedKey = ED25519Factory.hexToPrivateKey(privateKey);
      const publicKey = ED25519Factory.publicKeyFromPrivateKey(decodedKey);
      const rawAddress = Address.newAddress(0, publicKey);
      return {
        address: formatAddress(rawAddress.toString()),
        publicKey: ED25519Factory.publicKeyToHex(publicKey)
      };
    } else {
      const decodedKey = new Uint8Array(Buffer.from(privateKey, 'hex'));
      const blsPrivateKey = bls.secretKeyFromBytes(decodedKey);
      const publicKey = BLSFactory.publicKeyFromPrivateKey(blsPrivateKey);
      const bytes = bls.publicKeyToBytes(publicKey);
      const rawAddress = Address.newAddress(2, bytes);
      return {
        address: formatAddress(rawAddress.toString()),
        publicKey: Buffer.from(bytes).toString('hex')
      };
    }
  }

  public setSigner(privateKey: string, type: AuthType = 'ed25519') {
    if (!privateKey || privateKey.length < 64) {
      throw new Error("Private key is required and must be at least 64 characters");
    }
    this.rpcService.setSigner(privateKey);
  }

  public validateAddress(address: string): boolean {
    try {
      if (!address) return false;

      // Clean the address
      const cleanAddress = address.toLowerCase().trim();

      // Here: Handling different address formats:
      // 1. ED25519 addresses start with 0000
      // 2. BLS addresses start with 0002 (due to type ID 2)
      // Both are followed by 64 hex chars
      if (cleanAddress.startsWith('0000') || cleanAddress.startsWith('0002')) {
        // Total length should be 68 (4 chars prefix + 64 chars address)
        return /^(?:0000|0002)[0-9a-f]{64}$/i.test(cleanAddress);
      }

      return false;
    } catch {
      return false;
    }
  }

  // Expose block subscription functionality with proper typing
  listenToBlocks(callback: (block: any) => void) {
    return this.client.listenToBlocks((block: any) => callback(block));
  }
}

export {
  MAINNET_PUBLIC_API_BASE_URL,
  VM_NAME,
  VM_RPC_PREFIX,
} from "./endpoints";
export type { AuthType } from "./auth/provider";
