// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Api } from '../common/baseApi'
import { SDKConfig } from '../config/sdkConfig'
import {
  NUKLAI_VMAPI_METHOD_PREFIX,
  NUKLAI_VMAPI_PATH
} from '../constants/endpoints'

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
