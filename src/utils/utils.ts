import { sha256 } from '@noble/hashes/sha256'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import { stringifyWithBigInt } from './jsonUtils'

const BASE58_ALPHABET =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

export function cb58Encode(bytes: Uint8Array): string {
  let x = BigInt(`0x${bytesToHex(bytes)}`)
  let result = ''

  while (x > 0) {
    const remainder = Number(x % 58n)
    result = BASE58_ALPHABET[remainder] + result
    x = x / 58n
  }

  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
    result = '1' + result
  }

  return result
}

/**
 * Generate a transaction ID according to Avalanche format
 * Returns a 32-byte hash as a CB58-encoded string
 */
export function generateTxID(
  actionName: string,
  data: Record<string, unknown>
): string {
  const encoder = new TextEncoder()

  const txData = stringifyWithBigInt({
    actionName,
    data
  })

  // Generate SHA256 hash of the tx data
  const hash = sha256(encoder.encode(txData))

  // Convert the hash to a CB58-encoded string
  return cb58Encode(hash)
}

function formatAddress(address: string): string {
  const cleanAddr = address.replace(/^(0x|00)/, '')
  const paddedAddr = cleanAddr.padStart(66, '0')

  // Calculate checksum from the full bytes
  const addrBytes = hexToBytes(paddedAddr)
  const hash = sha256(addrBytes)
  const checksum = bytesToHex(hash.slice(-4))

  // Return in the exact format expected: (0x + address + checksum)
  return `0x${paddedAddr}${checksum}`
}

export async function formatAddressFields(
  data: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const addressFields = [
    'asset_address',
    'dataset_address',
    'marketplace_asset_address',
    'payment_asset_address',
    'asset_nft_address',
    'mint_admin',
    'pause_unpause_admin',
    'freeze_unfreeze_admin',
    'enable_disable_kyc_account_admin',
    'to',
    'dataset_contributor'
  ]

  const formatted: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string' && addressFields.includes(key)) {
      try {
        formatted[key] = formatAddress(value)
      } catch (error) {
        formatted[key] = value
      }
    } else if (value && typeof value === 'object') {
      formatted[key] = await formatAddressFields(
        value as Record<string, unknown>
      )
    } else {
      formatted[key] = value
    }
  }

  return formatted
}

export function formatAddressForAPI(address: string): string {
  // Remove any existing prefixes and checksum
  const cleanAddr = address.replace(/^(0x|00)/, '').slice(0, 64)

  // Add 00 prefix for API calls
  return `00${cleanAddr}`
}

/**
 * Format an address for balance queries
 */
export function formatAddressForBalance(address: string): string {
  const apiFormat = formatAddressForAPI(address)
  // For balance queries, we don't need the checksum
  return apiFormat.slice(0, 66)
}
