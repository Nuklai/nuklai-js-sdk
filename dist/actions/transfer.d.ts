import { actions } from '@nuklai/hyperchain-sdk';
export declare class Transfer extends actions.Transfer {
    constructor(to: string, asset: string, value: bigint, memo: string);
}
