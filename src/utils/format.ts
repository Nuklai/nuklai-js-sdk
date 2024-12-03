import {Buffer} from 'buffer';
import {encodeBase58Check} from './crypto';
import {utils} from "@avalabs/avalanchejs";
import bs58check from 'bs58check';

export function formatTxHash(hash: string): string {
    try {
        // Check if already correctly formatted (~49 chars, base58check)
        if (/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{48,50}$/.test(hash)) {
            return hash;
        }

        // Remove 0x prefix and validate 32 bytes (64 hex chars)
        const cleanHex = hash.replace(/^0x/i, '');
        if (cleanHex.length !== 64) {
            return ""; // Return empty string for invalid hashes
        }

        // Convert hex to bytes
        const hashBytes = Buffer.from(cleanHex, 'hex');
        return encodeBase58Check(hashBytes);
    } catch (error) {
        throw new Error("Invalid transaction hash format");
    }
}

export function formatAddress(address: string): string {
    if (!address) {
        throw new Error("Invalid address");
    }

    try {
        // Handle Bech32 format
        if (address.startsWith("nuklai1")) {
            const [hrp, decoded] = utils.parseBech32(address);
            if (hrp !== "nuklai") {
                throw new Error("Invalid address format");
            }
            return Buffer.from(decoded).toString("hex");
        }

        // Handle hex format - strip all prefixes
        const cleanHex = address.replace(/^0x/i, "").replace(/^00/i, "");
        if (!/^[0-9a-f]{64}$/i.test(cleanHex)) {
            throw new Error("Invalid address format");
        }
        return cleanHex.toLowerCase();
    } catch (error) {
        throw new Error("Invalid address");
    }
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