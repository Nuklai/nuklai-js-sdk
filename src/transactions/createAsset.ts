export class CreateAsset {
  constructor(
    public symbol: Uint8Array,
    public decimals: number,
    public metadata: Uint8Array
  ) {}
}
