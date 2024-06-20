export const ID_LEN = 32;
export const BOOL_LEN = 1;
export const BYTE_LEN = 1;
export const INT_LEN = 4;
export const UINT8_LEN = 1;
export const UINT16_LEN = 2;
export const UINT32_LEN = 4;
export const UINT64_LEN = 8;
export const INT64_LEN = 8;

// AvalancheGo imposes a limit of 2 MiB on the network, so we limit at
// 2 MiB - ProposerVM header - Protobuf encoding overhead (we assume this is
// no more than 50 KiB of overhead but is likely much less)
export const NETWORK_SIZE_LIMIT = 2_044_723; // 1.95 MiB

export const MaxUint8: number = 0xff;
export const MaxUint16: number = 0xffff;
export const MaxUint8Offset: number = 7;
// For 64-bit integer: "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
export const MaxUint: number = 0xffffffff; // Assuming 32-bit integer
export const MaxInt: number = Math.floor(0xffffffff / 2); // For 62-bit: MaxUint >> BigInt(1);
export const MaxUint64Offset: number = 63;
export const MaxUint64: bigint = BigInt("0xFFFFFFFFFFFFFFFF");
export const MillisecondsPerSecond: number = 1000;
