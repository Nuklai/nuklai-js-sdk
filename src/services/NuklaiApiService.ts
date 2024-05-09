import { Api } from '../common/baseApi'
import {
  NUKLAI_VMAPI_METHOD_PREFIX,
  NUKLAI_VMAPI_PATH
} from '../constants/endpoints'
import { SDKConfig } from '../types/SDKConfig'

export class NuklaiApiService extends Api {
  constructor(protected config: SDKConfig) {
    super(
      config.baseApiUrl,
      `/ext/bc/${config.blockchainId}/${NUKLAI_VMAPI_PATH}`,
      NUKLAI_VMAPI_METHOD_PREFIX
    )
  }

  // Other specific methods can be added here
}
