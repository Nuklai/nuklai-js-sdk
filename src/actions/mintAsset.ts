export class MintAsset {
  constructor(
    public to: Uint8Array,
    public asset: string,
    public value: number
  ) {}
}
