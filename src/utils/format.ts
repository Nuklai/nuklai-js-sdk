// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import {Buffer} from 'buffer';
import {utils} from "@avalabs/avalanchejs";
import {cb58Encode} from "./crypto";

export function formatTxHash(hash: string): string {
    if (!hash || !hash.trim()) {
        throw new Error("Invalid transaction hash format");
    }

    try {
        // Remove 0x prefix and clean hash
        const cleanHash = hash.replace(/^0x/i, '').toLowerCase();
        if (!/^[0-9a-f]{64}$/i.test(cleanHash)) {
            throw new Error("Invalid transaction hash format");
        }

        // Convert to bytes and encode
        const bytes = new Uint8Array(Buffer.from(cleanHash, 'hex'));
        return cb58Encode(bytes);
    } catch (error) {
        throw new Error("Invalid transaction hash format");
    }
}

export function formatAddress(address: string): string {
    if (!address || !address.trim()) {
        throw new Error("Invalid address");
    }

    // Clean input
    const cleanAddress = address.trim().toLowerCase();

    // Check if already formatted
    if (/^00[0-9a-f]{64}$/.test(cleanAddress)) {
        return cleanAddress;
    }

    try {
        // Handle Bech32 address format
        if (cleanAddress.startsWith("nuklai1")) {
            try {
                const [_, data] = utils.parseBech32(cleanAddress);
                return `00${Buffer.from(data).toString("hex")}`;
            } catch (e) {
                throw new Error("Invalid address");
            }
        }

        // Handle 0x prefix
        const withoutPrefix = cleanAddress.replace(/^0x/i, "");

        // Clean and format hex address
        const cleanHex = withoutPrefix.replace(/^00/i, "");

        // Validate hex string
        if (!/^[0-9a-f]{64}$/i.test(cleanHex)) {
            throw new Error("Invalid address");
        }

        return `00${cleanHex}`;
    } catch (error) {
        if (error instanceof Error && error.message === "Unknown letter") {
            throw error;
        }
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