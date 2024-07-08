import { Id } from '@avalabs/avalanchejs';
export declare function parseBalance(amount: string | number, decimals: number): bigint;
export declare function formatBalance(parsedAmount: number | bigint, decimals: number): number;
export declare function getUnixRMilli(now: number, add: number): bigint;
export declare function bufferEquals(buf1: Uint8Array, buf2: Uint8Array): boolean;
export declare function toAssetID(asset: string): Id;
