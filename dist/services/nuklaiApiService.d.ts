import { common, config } from '@nuklai/hyperchain-sdk';
export declare class NuklaiApiService extends common.Api {
    protected configNuklai: config.NodeConfig;
    constructor(configNuklai: config.NodeConfig);
}
