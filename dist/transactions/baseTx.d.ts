import { Id } from '@avalabs/avalanchejs';
export declare const BaseTxSize: number;
export declare class BaseTx {
    timestamp: bigint;
    chainId: Id;
    maxFee: bigint;
    constructor(timestamp: bigint, chainId: Id, maxFee: bigint);
    size(): number;
    toBytes(): Uint8Array;
    static fromBytes(bytes: Uint8Array): [BaseTx, Error?];
}
