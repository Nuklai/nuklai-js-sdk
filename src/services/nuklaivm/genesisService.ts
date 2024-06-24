// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { GetGenesisInfoResponse } from '../../common/nuklaiApiModels'
import { NuklaiApiService } from '../nuklaiApiService'

export class GenesisService extends NuklaiApiService {
  getGenesisInfo(): Promise<GetGenesisInfoResponse> {
    return this.callRpc<GetGenesisInfoResponse>('genesis')
  }
}
