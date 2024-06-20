export interface Action {
  getTypeId(): number;
  toBytes(): Uint8Array;
  size(): number;
  computeUnits(): number;
  stateKeysMaxChunks(): number[];
}
