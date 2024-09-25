// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions } from '@nuklai/hyperchain-sdk'
import { Id } from '@avalabs/avalanchejs'

export class Transfer extends actions.Transfer {
  public asset: Id
  public nftID?: Id

  constructor(to: string, asset: string, value: bigint, memo: string) {
    super(to, asset, value, memo)
  }
}