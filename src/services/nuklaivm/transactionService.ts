import { Id } from "@avalabs/avalanchejs";
import { Transfer } from "../../actions/transfer";
import {
  BLSFactory,
  GetPublicKeyFromPrivateKey,
  NewBLSAddress,
  formatAddress,
  hexToSecretKey
} from "../../auth/bls";
import {
  GetBalanceParams,
  GetBalanceResponse,
  GetTransactionInfoParams,
  GetTransactionInfoResponse
} from "../../common/nuklaiApiModels";
import { DECIMALS } from "../../constants/nuklaivm";
import { HyperApiService } from "../hyperApiService";
import { NuklaiApiService } from "../nuklaiApiService";
import { Address } from "../../utils/address";
import { EMPTY_ID } from "../../constants/consts";

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

    const toAddress = Address.fromString(to);

    // Fetch the balance to ensure sufficient funds
    const balanceResponse = await this.getBalance(fromAddress, assetID);
    if (BigInt(balanceResponse.amount) < amountInUnits) {
      throw new Error("Insufficient balance");
    }

    const transfer: Transfer = new Transfer(
      toAddress,
      EMPTY_ID,
      amountInUnits,
      memo
    );

    const { submit, txSigned, err } =
      await this.hyperApiService.generateTransaction(transfer, blsFactory);
    if (err) {
      throw err;
    }
    await submit({});
    return txSigned.id().toString();
  }

  private async getBalance(
    address: string,
    asset: string
  ): Promise<GetBalanceResponse> {
    const params: GetBalanceParams = { address, asset };
    return this.callRpc<GetBalanceResponse>("balance", params);
  }

  private parseBalance(amount: string, decimals: number): bigint {
    return BigInt(Math.floor(parseFloat(amount) * Math.pow(10, decimals)));
  }
}
