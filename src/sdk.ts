import { RpcService } from "./rpcService";
import {
  MAINNET_PUBLIC_API_BASE_URL,
  VM_NAME,
  VM_RPC_PREFIX,
} from "./endpoints";
import { Block } from "hypersdk-client/dist/apiTransformers";
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

export class NuklaiSDK {
  public rpcService: RpcService;
  private client: NuklaiVMClient;

  constructor(baseApiUrl = MAINNET_PUBLIC_API_BASE_URL, privateKey?: string) {
    this.rpcService = new RpcService(baseApiUrl);

    this.client = new NuklaiVMClient(baseApiUrl, VM_NAME, VM_RPC_PREFIX);

    if (privateKey) {
      this.setSigner(privateKey);
    }
  }

  public generateED25519Wallet() {
    const { privateKey, publicKey } = ED25519Factory.generateKeyPair();

    return {
      privateKey: ED25519Factory.privateKeyToHex(privateKey),
      publicKey: ED25519Factory.publicKeyToHex(publicKey),
      addres: Address.newAddress(0, publicKey).toString(),
    };
  }

  public generateBLSWallet() {
    const { privateKey, publicKey } = BLSFactory.generateKeyPair();
    return {
      privateKey: BLSFactory.privateKeyToHex(privateKey),
      publicKey: BLS.publicKeyToHex(publicKey),
      address: Address.newAddress(
        2,
        BLSFactory.publicKeyFromPrivateKey(privateKey)
      ).toString(),
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
      const publicKey = BLSFactory.publicKeyFromPrivateKey(
        BLSFactory.hexToPrivateKey(privateKey)
      );
      return {
        address: Address.newAddress(2, publicKey).toString(),
        publicKey: BLS.publicKeyToHex(publicKey),
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

  public async listenToBlocks(
    callback: (block: Block) => void,
    includeEmpty?: boolean,
    pollingRateMs?: number
  ): Promise<() => void> {
    return this.client.listenToBlocks(callback, includeEmpty, pollingRateMs);
  }
}

export {
  MAINNET_PUBLIC_API_BASE_URL,
  VM_NAME,
  VM_RPC_PREFIX,
} from "./endpoints";

export type { AuthType } from "./auth/provider";
