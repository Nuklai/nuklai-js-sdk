import { Action } from '../actions/action';
import { AuthFactory } from '../auth/auth';
import { Genesis } from '../common/nuklaiApiModels';
type Dimension = number[];
export declare function mulSum(a: Dimension, b: Dimension): [bigint, Error?];
export declare function estimateUnits(genesisInfo: Genesis, actions: Action[], authFactory: AuthFactory): Dimension;
export {};
