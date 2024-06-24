// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

export class CreateAsset {
  constructor(
    public symbol: Uint8Array,
    public decimals: number,
    public metadata: Uint8Array
  ) {}
}
