export interface Auth {
  getTypeId(): number;
  verify(message: Uint8Array): Promise<boolean>;
  actor(): Uint8Array;
  sponsor(): Uint8Array;
  size(): number;
  toBytes(): Uint8Array;
}

export interface AuthFactory {
  sign(msg: Uint8Array): Auth;
  computeUnits(): number;
  bandwidth(): number;
}
