// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { createHash } from 'crypto';
import bs58check from 'bs58check';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

// Hash function using Node.js's crypto module
export function sha256(data: Uint8Array): Uint8Array {
    return new Uint8Array(createHash('sha256').update(data).digest());
}

export function doubleSha256(data: Uint8Array): Uint8Array {
    return sha256(sha256(data));
}

// Encapsulate the Base58Check encoding using bs58check library
// export function encodeBase58Check(input: Uint8Array): string {
//     return bs58check.encode(Buffer.from(input));
// }

export function cb58Encode(input: Uint8Array): string {
    // Calculate checksum using double SHA256
    const checksum = doubleSha256(input).slice(0, 4);

    // Add checksum to the end
    const withChecksum = new Uint8Array(input.length + 4);
    withChecksum.set(input);
    withChecksum.set(checksum, input.length);

    // Convert bytes to base58
    let n = BigInt('0x' + Buffer.from(withChecksum).toString('hex'));
    const result: string[] = [];

    // Handle case where n is 0
    if (n === 0n) {
        return '1';
    }

    while (n > 0n) {
        const remainder = Number(n % 58n);
        result.unshift(BASE58_ALPHABET[remainder]);
        n = n / 58n;
    }

    // Properly handle leading zeros
    for (let i = 0; i < withChecksum.length && withChecksum[i] === 0; i++) {
        result.unshift('1');
    }

    return result.join('');
}