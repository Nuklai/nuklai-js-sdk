// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { sha256 } from '@noble/hashes/sha256';
import { sha512 } from '@noble/hashes/sha512';

interface HashObject {
    update(data: Uint8Array): HashObject;
    digest(): Uint8Array;
}

function createHash(algorithm: 'sha256' | 'sha512'): HashObject {
    let data: Uint8Array | null = null;

    return {
        update(newData: Uint8Array): HashObject {
            if (data === null) {
                data = newData;
            } else {
                const combinedData = new Uint8Array(data.length + newData.length);
                combinedData.set(data);
                combinedData.set(newData, data.length);
                data = combinedData;
            }
            return this;
        },
        digest(): Uint8Array {
            if (data === null) {
                throw new Error('No data to hash');
            }
            return algorithm === 'sha256' ? sha256(data) : sha512(data);
        }
    };
}

export function getCreateHash() {
    return createHash;
}

export function getSha512() {
    return (...messages: Uint8Array[]): Uint8Array => {
        const hash = createHash('sha512');
        for (const message of messages) {
            hash.update(message);
        }
        return hash.digest();
    };
}