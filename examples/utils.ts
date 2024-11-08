import fetch from 'node-fetch'

export const API_HOST = 'http://127.0.0.1:9650'
export const NAI_ASSET_ADDRESS =
  '00cf77495ce1bdbf11e5e45463fad5a862cb6cc0a20e00e658c4ac3355dcdc64bb'
export const TEST_ADDRESS =
  '00c4cb545f748a28770042f893784ce85b107389004d6a0e0d6d7518eeae1292d9'
export const TEST_ADDRESS2 =
  '002b5d019495996310f81c6a26a4dd9eeb9a3f3be1bac0a9294436713aecc84496'
export const TEST_ADDRESS_PRIVATE_KEY =
  '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7'

export async function verifyEndpoint(endpoint: string): Promise<{
  isValid: boolean
  details: string
}> {
  try {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'hypersdk.network',
      params: {}
    }

    const response = await fetch(`${endpoint}/ext/bc/nuklaivm/coreapi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const contentType = response.headers.get('content-type')
    const text = await response.text()

    console.log('Response details:', {
      status: response.status,
      contentType,
      bodyPreview: text.substring(0, 100) // First 100 chars
    })

    return {
      isValid: contentType?.includes('application/json') ?? false,
      details: `Status: ${response.status}, Content-Type: ${contentType}`
    }
  } catch (error) {
    return {
      isValid: false,
      details: `Error: ${
        error instanceof Error ? error.message : String(error)
      }`
    }
  }
}

// Helper function to generate a random alphanumeric string of specified length
export function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
