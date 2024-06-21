import {
  parseAddress,
  hexToSecretKey,
  GetPublicKeyFromPrivateKey,
  NewBLSAddress,
  formatAddress,
  BLSFactory
} from "../../auth/bls";
import {
  GetBalanceParams,
  GetBalanceResponse,
  GetTransactionInfoParams,
  GetTransactionInfoResponse
} from "../../common/nuklaiApiModels";
import { DECIMALS } from "../../constants/nuklaivm";
import { Transfer } from "../../actions/transfer";
import { HyperApiService } from "../hyperApiService";
import { NuklaiApiService } from "../nuklaiApiService";
import { Id } from "@avalabs/avalanchejs";

export class TransactionService extends NuklaiApiService {
  private hyperApiService: HyperApiService;

  constructor(config: any) {
    super(config);
    this.hyperApiService = new HyperApiService(config);
  }

  getTransactionInfo(
    getTransactionInfoParams: GetTransactionInfoParams
  ): Promise<GetTransactionInfoResponse> {
    return this.callRpc<GetTransactionInfoResponse>(
      "tx",
      getTransactionInfoParams
    );
  }

  async createAndSubmitTransferTransaction(
    to: string,
    asset: string,
    amount: string,
    memo: string,
    privateKeyHex: string
  ): Promise<string> {
    // Convert the private key from hex string to bls.SecretKey
    const privateKey = hexToSecretKey(privateKeyHex);
    const blsFactory = new BLSFactory(privateKey);

    // Generate the from address using the private key
    const publicKey = GetPublicKeyFromPrivateKey(privateKey);
    const fromAddress = formatAddress(NewBLSAddress(publicKey));

    // Default asset to NAI if asset is "NAI"
    const assetID = asset;

    const decimals = DECIMALS;
    const amountInUnits = this.parseBalance(amount, decimals);
    const toAddress = this.parseAddress(to);

    // Fetch the balance to ensure sufficient funds
    const balanceResponse = await this.getBalance(fromAddress, assetID);
    if (BigInt(balanceResponse.amount) < amountInUnits) {
      throw new Error("Insufficient balance");
    }

    const transfer: Transfer = new Transfer(
      toAddress,
      Id.fromString(asset),
      amountInUnits,
      new TextEncoder().encode(memo)
    );

    const { submit, tx } = await this.hyperApiService.generateTransaction(
      transfer,
      blsFactory
    );
    await submit({});
    return tx.id().toString();
  }

  private async getBalance(
    address: string,
    asset: string
  ): Promise<GetBalanceResponse> {
    const params: GetBalanceParams = { address, asset };
    return this.callRpc<GetBalanceResponse>("balance", params);
  }

  private parseBalance(amount: string, decimals: number): bigint {
    return BigInt(parseFloat(amount) * Math.pow(10, decimals));
  }

  private parseAddress(address: string): Uint8Array {
    return parseAddress(address);
  }
}
