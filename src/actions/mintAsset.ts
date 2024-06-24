// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

export class MintAsset {
  constructor(
    public to: Uint8Array,
    public asset: string,
    public value: number
  ) {}
}
