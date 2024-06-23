import { Id } from "@avalabs/avalanchejs";

import { Transfer } from "../actions/transfer";
import { AuthFactory } from "../auth/auth";
import { Api } from "../common/baseApi";
import {
  GetLastAcceptedResponse,
  GetNetworkInfoResponse,
  GetUnitPricesResponse,
  GetWarpSignaturesResponse,
  PingResponse,
  SubmitTransactionResponse
} from "../common/hyperApiModels";
import { GetGenesisInfoResponse } from "../common/nuklaiApiModels";
import { SDKConfig } from "../config/sdkConfig";
import {
  NUKLAI_COREAPI_METHOD_PREFIX,
  NUKLAI_COREAPI_PATH
} from "../constants/endpoints";
import { BaseTx } from "../transactions/baseTx";
import { estimateUnits, mulSum } from "../transactions/fees";
import { Transaction } from "../transactions/transaction";
import { GenesisService } from "./nuklaivm/genesisService";

export class HyperApiService extends Api {
  private genesisApiService: GenesisService;

  constructor(protected config: SDKConfig) {
    super(
      config.baseApiUrl,
      `/ext/bc/${config.blockchainId}/${NUKLAI_COREAPI_PATH}`,
      NUKLAI_COREAPI_METHOD_PREFIX
    );
    this.genesisApiService = new GenesisService(config);
  }

  ping(): Promise<PingResponse> {
    return this.callRpc<PingResponse>("ping");
  }

  // Retrieve network IDs
  getNetworkInfo(): Promise<GetNetworkInfoResponse> {
    return this.callRpc<GetNetworkInfoResponse>("network");
  }

  // Get information about the last accepted block
  getLastAccepted(): Promise<GetLastAcceptedResponse> {
    return this.callRpc<GetLastAcceptedResponse>("lastAccepted");
  }

  // Fetch current unit prices for transactions
  getUnitPrices(): Promise<GetUnitPricesResponse> {
    return this.callRpc<GetUnitPricesResponse>("unitPrices");
  }

  // Fetch warp signatures associated with a transaction
  getWarpSignatures(txID: string): Promise<GetWarpSignaturesResponse> {
    return this.callRpc<GetWarpSignaturesResponse>("getWarpSignatures", {
      txID
    });
  }

  // Submit a transaction to the network
  async submitTransaction(tx: Uint8Array): Promise<SubmitTransactionResponse> {
    return this.callRpc<SubmitTransactionResponse>("submitTx", { d: tx });
  }

  async generateTransaction(
    action: Transfer,
    authFactory: AuthFactory
  ): Promise<{
    submit: (ctx: any) => Promise<void>;
    tx: Transaction;
    err: Error | undefined;
  }> {
    try {
      // Construct the base transaction
      // Set timestamp
      const genesisInfo: GetGenesisInfoResponse =
        await this.genesisApiService.getGenesisInfo();
      const timestamp: bigint =
        BigInt(Date.now()) + BigInt(genesisInfo.genesis.validityWindow);
      // Set chain ID
      const chainId = Id.fromString(this.config.blockchainId);
      // Set maxFee
      const unitPrices: GetUnitPricesResponse = await this.getUnitPrices();
      const units = estimateUnits(genesisInfo.genesis, [action], authFactory);
      const [maxFee, error] = mulSum(unitPrices.unitPrices, units);
      if (error) {
        return {
          submit: async () => {
            throw new Error("Transaction failed, cannot submit.");
          },
          tx: {} as Transaction,
          err: error as Error
        };
      }

      console.log("submitting");
      const base = new BaseTx(timestamp, chainId, maxFee);

      let tx: Transaction = new Transaction(base, [action]);

      // Sign the transaction
      tx = tx.sign(authFactory);

      const submit = async () => {
        const txBytes = tx.toBytes();

        await this.submitTransaction(txBytes);
      };

      return { submit, tx, err: undefined };
    } catch (error) {
      return {
        submit: async () => {
          throw new Error("Transaction failed, cannot submit.");
        },
        tx: {} as Transaction,
        err: error as Error
      };
    }
  }
}
