import {
  GetTransactionInfoParams,
  GetTransactionInfoResponse
} from '../../common/nuklaiApiModels'
import { NuklaiApiService } from '../NuklaiApiService'

export class TransactionService extends NuklaiApiService {
  getTransactionInfo(
    getTransactionInfoParams: GetTransactionInfoParams
  ): Promise<GetTransactionInfoResponse> {
    return this.callRpc<GetTransactionInfoResponse>(
      'tx',
      getTransactionInfoParams
    )
  }
}
