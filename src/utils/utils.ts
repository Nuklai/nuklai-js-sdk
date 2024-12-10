import { base58 } from "@scure/base";
import { sha256 } from "@noble/hashes/sha256";

export function generateTxID(
  actionName: string,
  data: Record<string, unknown>
): string {
  // Encode the transaction data
  const encoder = new TextEncoder();
  const txData = encoder.encode(JSON.stringify({ actionName, data }));

  // Get SHA256 hash
  const hash = sha256(txData);

  // CB58 encode (base58 with 32-byte length limit and checksum)
  const checksumHash = sha256(hash);
  const checksum = checksumHash.slice(-4);

  // Combine hash and checksum before base58 encoding
  const combined = new Uint8Array([...hash, ...checksum]);

  // Return base58 encoded string
  return base58.encode(combined);
}
