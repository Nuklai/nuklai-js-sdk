import { Id } from '@avalabs/avalanchejs';
import { Address } from '../utils';

export const ADDRESS_LEN = 20;
export const ID_LEN = 32;
export const UINT8_LEN = 1;
export const BYTE_LEN = 1;
export const SHORT_LEN = 2;
export const INT_LEN = 4;
export const LONG_LEN = 8;
export const MaxStringLen = 1024;
export const MaxUint8 = 255;
export const MillisecondsPerSecond = 1000n;

// Empty instances
export const EMPTY_ADDRESS = new Address(new Uint8Array(ADDRESS_LEN));
export const EMPTY_ID = new Id(new Uint8Array(ID_LEN));