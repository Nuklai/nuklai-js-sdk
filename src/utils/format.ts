import {Buffer} from 'buffer';
import {encodeBase58Check} from './crypto';

export function formatTxHash(hash: string): string {
    const cleanHex = hash.replace('0x', '');
    const bytes = new Uint8Array(Buffer.from(cleanHex, 'hex'));
    return encodeBase58Check(bytes);
}

export function formatAddress(address: string): string {
    if (address.startsWith('nuklai1')) {
        address = address.slice(7);
    }
    // Ensure address starts with "00"
    if (!address.startsWith('00')) {
        return '00' + address;
    }
    return address;
}

export function formatBlockHash(hash: string): string {
    return formatTxHash(hash);
}

export function formatTransactionResponse(response: any): any {
    if (!response) return response;

    return {
        ...response,
        txId: formatTxHash(response.txId),
        result: {
            ...response.result,
            timestamp: response.result.timestamp,
            success: response.result.success,
            sponsor: formatAddress(response.result.sponsor),
            units: {
                bandwidth: response.result.units?.bandwidth || 0,
                compute: response.result.units?.compute || 0,
                storageRead: response.result.units?.storageRead || 0,
                storageAllocate: response.result.units?.storageAllocate || 0,
                storageWrite: response.result.units?.storageWrite || 0
            },
            fee: response.result.fee,
            blockHash: response.result.blockHash ? formatBlockHash(response.result.blockHash) : undefined,
            results: response.result.results?.map((result: any) => ({
                ...result,
                // Format all addresses and hashes in results
                address: result.address ? formatAddress(result.address) : undefined,
                asset_id: result.asset_id ? formatAddress(result.asset_id) : undefined,
                dataset_address: result.dataset_address ? formatAddress(result.dataset_address) : undefined,
                payment_asset_address: result.payment_asset_address ? formatAddress(result.payment_asset_address) : undefined,
                marketplace_asset_address: result.marketplace_asset_address ? formatAddress(result.marketplace_asset_address) : undefined,
            }))
        }
    };
}