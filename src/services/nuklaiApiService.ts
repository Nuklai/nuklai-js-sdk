// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { common, config } from '@nuklai/hyperchain-sdk'
import {
  NUKLAI_VMAPI_METHOD_PREFIX,
  NUKLAI_VMAPI_PATH
} from '../constants/endpoints'

export class NuklaiApiService extends common.Api {
  constructor(protected configNuklai: config.NodeConfig) {
    super(
      configNuklai.baseApiUrl,
      `/ext/bc/${configNuklai.blockchainId}/${NUKLAI_VMAPI_PATH}`,
      NUKLAI_VMAPI_METHOD_PREFIX
    )
  }

  // Other specific methods can be added here
}
