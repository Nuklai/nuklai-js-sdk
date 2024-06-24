// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { Address } from '../utils/address'

export const BOOL_LEN = 1
export const BYTE_LEN = 1
export const SHORT_LEN = 1
export const UINT8_LEN = 1
export const UINT16_LEN = 2
export const INT_LEN = 4
export const UINT32_LEN = 4
export const UINT64_LEN = 8
export const INT64_LEN = 8
export const LONG_LEN = 8
export const ID_LEN = 32
export const ADDRESS_LEN = 33

export const EMPTY_ID = new Id(new Uint8Array(ID_LEN))
export const EMPTY_ADDRESS = new Address(new Uint8Array(ADDRESS_LEN))

// AvalancheGo imposes a limit of 2 MiB on the network, so we limit at
// 2 MiB - ProposerVM header - Protobuf encoding overhead (we assume this is
// no more than 50 KiB of overhead but is likely much less)
export const NETWORK_SIZE_LIMIT = 2_044_723 // 1.95 MiB

export const MaxUint8 = 0xff // 255
export const MaxUint16 = 0xffff // 65535
export const MaxUint8Offset = 7
export const MaxUint = Number.MAX_SAFE_INTEGER // 9007199254740991 (Note: JavaScript does not have a direct equivalent for 64-bit unsigned integers)
export const MaxInt = Math.floor(MaxUint / 2) // 4503599627370495
export const MaxUint64Offset = 63
export const MaxUint64 = BigInt('0xFFFFFFFFFFFFFFFF') // 18446744073709551615n
export const MillisecondsPerSecond: bigint = BigInt(1000)
export const MaxStringLen = 65535 // math.MaxUint16 in Go
