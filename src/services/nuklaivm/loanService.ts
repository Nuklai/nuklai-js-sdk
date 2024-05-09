import {
  GetLoanInfoParams,
  GetLoanInfoResponse
} from '../../common/nuklaiApiModels'
import { NuklaiApiService } from '../nuklaiApiService'

export class LoanService extends NuklaiApiService {
  getLoanInfo(
    getLoanInfoParams: GetLoanInfoParams
  ): Promise<GetLoanInfoResponse> {
    return this.callRpc<GetLoanInfoResponse>('loan', getLoanInfoParams)
  }
}
