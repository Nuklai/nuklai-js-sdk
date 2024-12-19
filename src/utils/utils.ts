import { sha256 } from '@noble/hashes/sha256'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import { stringifyWithBigInt } from './jsonUtils'

const BASE58_ALPHABET =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

export function cb58Encode(bytes: Uint8Array): string {
  let x = BigInt(`0x${bytesToHex(bytes)}`)
  let result = ''

  while (x > 0n) {
    const remainder = Number(x % 58n)
    result = BASE58_ALPHABET[remainder] + result
    x = x / 58n
  }

  // Handle leading zeros
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
    result = BASE58_ALPHABET[0] + result
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

  const txData = stringifyWithBigInt({ actionName, data })

  // Generate SHA256 hash of the tx data
  const hash = sha256(encoder.encode(txData))

  // Convert the hash to a CB58-encoded string
  return cb58Encode(hash)
}

function isAddress(value: unknown): boolean {
  if (typeof value !== 'string') return false

  // Remove common prefixes
  const cleanValue = value.replace(/^(0x|00)/, '')

  // Check if the remaining string is a valid hex string of acceptable lengths
  return (
    /^[a-fA-F0-9]+$/.test(cleanValue) &&
    [64, 66, 70, 74].includes(cleanValue.length)
  )
}

function formatAddress(address: string): string {
  const cleanAddr = address.replace(/^(0x|00)/, '')

  // If the address is already 74 characters, assume it's valid
  if (cleanAddr.length === 74) {
    return `0x${cleanAddr}`
  }

  // If the address is shorter than 74 characters, pad and calculate checksum
  if ([64, 66, 70].includes(cleanAddr.length)) {
    const paddedAddr = cleanAddr.padStart(66, '0') // Pad to 66 characters
    const addrBytes = hexToBytes(paddedAddr) // Convert to bytes
    const hash = sha256(addrBytes) // Calculate checksum
    const checksum = bytesToHex(hash.slice(-4)) // Get the last 4 bytes as checksum
    return `0x${paddedAddr}${checksum}`
  }

  // Throw an error for unsupported lengths
  throw new Error(
    `Invalid address length: ${cleanAddr.length}. Address: ${address}`
  )
}

export async function formatAddressFields(
  data: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const formatted: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string' && isAddress(value)) {
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

/**
 * Format an address for API calls.
 * Handles prefixes, validates the input, and ensures proper formatting.
 */
export function formatAddressForAPI(address: string): string {
  // Remove any existing prefixes
  const cleanAddr = address.replace(/^(0x|00)/, '')

  // Validate the address
  if (![64, 66, 70, 74].includes(cleanAddr.length)) {
    throw new Error(
      `Invalid address length for API: ${cleanAddr.length}. Address: ${address}`
    )
  }

  // Ensure the address is truncated to 64 characters and add the "00" prefix
  const truncatedAddr = cleanAddr.slice(0, 64)
  return `00${truncatedAddr}`
}

/**
 * Format an address for balance queries.
 * Ensures compatibility by removing checksum and formatting appropriately.
 */
export function formatAddressForBalance(address: string): string {
  // Use the API format as the base
  const apiFormat = formatAddressForAPI(address)

  // Ensure the result is 66 characters long by slicing to match expected format
  return apiFormat.slice(0, 66)
}
