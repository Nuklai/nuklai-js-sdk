import { Id } from '@avalabs/avalanchejs';
export declare function ToID(bytes: Uint8Array): Uint8Array;
export declare function createActionID(txID: Id, i: number): Id;
