import { Buffer } from 'buffer';
import { createHash } from 'crypto';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export function sha256(data: Uint8Array): Uint8Array {
    // Convert Buffer to Uint8Array explicitly
    return new Uint8Array(createHash('sha256').update(new Uint8Array(data)).digest());
}

export function doubleSha256(data: Uint8Array): Uint8Array {
    return sha256(sha256(data));
}

export function encodeBase58Check(input: Uint8Array): string {
    // Checksum
    const checksum = doubleSha256(input).slice(0, 4);
    const withChecksum = new Uint8Array(input.length + 4);
    withChecksum.set(input);
    withChecksum.set(checksum, input.length);

    // BigInt for encoding here
    let n = BigInt('0x' + Buffer.from(withChecksum).toString('hex'));
    let result = '';

    while (n > 0) {
        const remainder = Number(n % BigInt(58));
        n = n / BigInt(58);
        result = BASE58_ALPHABET[remainder] + result;
    }

    for (let i = 0; i < input.length && input[i] === 0; i++) {
        result = '1' + result;
    }

    return result;
}