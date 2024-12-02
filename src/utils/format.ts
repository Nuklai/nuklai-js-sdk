import { Buffer } from 'buffer';

export function encodeToBase58(input: Uint8Array): string {
    const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let n = BigInt('0x' + Buffer.from(input).toString('hex'));
    let result = '';
    while (n > 0) {
        const remainder = Number(n % BigInt(58));
        n = n / BigInt(58);
        result = BASE58_ALPHABET[remainder] + result;
    }
    // Add the leading zeros
    for (let i = 0; i < input.length && input[i] === 0; i++) {
        result = BASE58_ALPHABET[0] + result;
    }
    return result;
}

export function formatTxHash(hash: string): string {
    // Remove '0x' prefix if present
    const cleanHex = hash.replace('0x', '');
    // Convert hex to Uint8Array
    const bytes = new Uint8Array(Buffer.from(cleanHex, 'hex'));
    // Convert to base58check format
    return encodeToBase58(bytes);
}

export function formatBlockHash(hash: string): string {
    return formatTxHash(hash);
}

export function formatAddress(address: string): string {
    // Ensure the address starts with "00"
    if (!address.startsWith('00')) {
        return '00' + address;
    }
    return address;
}

export function formatTransactionResponse(response: any): any {
    if (!response) return response;

    return {
        ...response,
        txId: formatTxHash(response.txId),
        result: {
            ...response.result,
            sponsor: formatAddress(response.result.sponsor),
            blockHash: response.result.blockHash ? formatBlockHash(response.result.blockHash) : undefined,
            results: response.result.results?.map((result: any) => ({
                ...result,
                address: result.address ? formatAddress(result.address) : undefined,
            }))
        }
    };
}