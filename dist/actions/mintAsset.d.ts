import { Id } from '@avalabs/avalanchejs';
import { actions, utils } from '@nuklai/hyperchain-sdk';
export declare const MintAssetTxSize: number;
export declare class MintAsset implements actions.Action {
    to: utils.Address;
    asset: Id;
    value: bigint;
    constructor(to: string, asset: string, value: bigint);
    getTypeId(): number;
    size(): number;
    computeUnits(): number;
    stateKeysMaxChunks(): number[];
    toJSON(): object;
    toString(): string;
    toBytes(): Uint8Array;
    static fromBytes(bytes: Uint8Array): [MintAsset, Error?];
    static fromBytesCodec(codec: utils.Codec): [MintAsset, utils.Codec];
}
