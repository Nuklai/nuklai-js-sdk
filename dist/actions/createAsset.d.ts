import { actions, utils } from '@nuklai/hyperchain-sdk';
export declare const CreateAssetTxSize: number;
export declare class CreateAsset implements actions.Action {
    symbol: Uint8Array;
    decimals: number;
    metadata: Uint8Array;
    constructor(symbol: string, decimals: number, metadata: string);
    getTypeId(): number;
    size(): number;
    computeUnits(): number;
    stateKeysMaxChunks(): number[];
    toJSON(): object;
    toString(): string;
    toBytes(): Uint8Array;
    static fromBytes(bytes: Uint8Array): [CreateAsset, Error?];
    static fromBytesCodec(codec: utils.Codec): [CreateAsset, utils.Codec];
}
