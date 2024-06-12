import {
  GetTransactionInfoParams,
  GetTransactionInfoResponse
} from "../../common/nuklaiApiModels";
import { NuklaiApiService } from "../nuklaiApiService";
import { BLSService } from "../crypto/blsService";
import {
  GetBalanceParams,
  GetBalanceResponse
} from "../../common/nuklaiApiModels";
import { DECIMALS } from "../../constants/nuklaivm";

export class TransactionService extends NuklaiApiService {
  getTransactionInfo(
    getTransactionInfoParams: GetTransactionInfoParams
  ): Promise<GetTransactionInfoResponse> {
    return this.callRpc<GetTransactionInfoResponse>(
      "tx",
      getTransactionInfoParams
    );
  }

  async createTransferTransaction(
    from: string,
    to: string,
    asset: string,
    amount: string,
    memo: string
  ): Promise<Uint8Array> {
    const assetID = asset;
    const decimals = DECIMALS;
    const amountInUnits = this.parseBalance(amount, decimals);
    const toAddress = BLSService.parseAddress(to);

    // Fetch the balance to ensure sufficient funds
    const balanceResponse = await this.getBalance(from, asset);
    if (balanceResponse.amount < amountInUnits) {
      throw new Error("Insufficient balance");
    }

    // Create the transaction
    const tx = {
      from,
      to: toAddress,
      asset: assetID,
      amount: amountInUnits,
      memo: memo
    };

    // Return the transaction bytes
    return this.serializeTransaction(tx);
  }

  async signAndSendTransaction(
    privateKey: string,
    transaction: Uint8Array
  ): Promise<string> {
    // Convert privateKey to bls.SecretKey
    const secretKey = BLSService.hexToSecretKey(privateKey);

    // Sign the transaction
    const signature = BLSService.sign(transaction, secretKey);

    // Submit the transaction
    const response = await this.callRpc<{ txId: string }>("submitTx", {
      transaction,
      signature
    });
    return response.txId;
  }

  private async getBalance(
    address: string,
    asset: string
  ): Promise<GetBalanceResponse> {
    const params: GetBalanceParams = { address, asset };
    return this.callRpc<GetBalanceResponse>("balance", params);
  }

  private parseBalance(amount: string, decimals: number): number {
    return parseFloat(amount) * Math.pow(10, decimals);
  }

  private serializeTransaction(tx: any): Uint8Array {
    // Implement serialization logic for the transaction
    return new Uint8Array(); // Placeholder
  }
}
