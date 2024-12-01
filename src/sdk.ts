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

  public generateED25519Wallet() {
    const { privateKey, publicKey } = ED25519Factory.generateKeyPair();
    return {
      privateKey: ED25519Factory.privateKeyToHex(privateKey),
      publicKey: ED25519Factory.publicKeyToHex(publicKey),
      address: Address.newAddress(0, publicKey).toString(),
    };
  }

  public generateBLSWallet() {
    const { privateKey, publicKey } = BLSFactory.generateKeyPair();
    const bytes = bls.publicKeyToBytes(publicKey);

    return {
      privateKey: BLSFactory.privateKeyToHex(privateKey),
      publicKey: Buffer.from(bytes).toString("hex"),
      address: Address.newAddress(2, bytes).toString(),
    };
  }

  public importWallet(privateKey: string, type: AuthType = "ed25519") {
    const factory = getAuthFactory(type, privateKey);
    if (type === "ed25519") {
      const publicKey = ED25519Factory.publicKeyFromPrivateKey(
        ED25519Factory.hexToPrivateKey(privateKey)
      );
      return {
        address: Address.newAddress(0, publicKey).toString(),
        publicKey: ED25519Factory.publicKeyToHex(publicKey),
      };
    } else {
      const blsPrivateKey = BLSFactory.hexToPrivateKey(privateKey);
      const publicKey = BLSFactory.publicKeyFromPrivateKey(blsPrivateKey);
      const bytes = bls.publicKeyToBytes(publicKey);

      return {
        address: Address.newAddress(2, bytes).toString(),
        publicKey: Buffer.from(bytes).toString("hex"),
      };
    }
  }

  setSigner(privateKey: string, type: AuthType = "ed25519") {
    this.rpcService.setSigner(privateKey);
  }

  public validateAddress(address: string): boolean {
    try {
      Address.fromString(address);
      return true;
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
