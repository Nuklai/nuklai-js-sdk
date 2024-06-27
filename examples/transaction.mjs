// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { NuklaiSDK, auth } from '../dist/index.js'

const sdk = new NuklaiSDK({
  baseApiUrl: 'http://127.0.0.1:9650',
  blockchainId: 'iVGwRKQ6jTrhsuG1FpQjtFcs6awhRTZYtzq8dLidUL6Xz2PYK'
})

async function testSDK() {
  console.log('Starting SDK tests...')

  // Testing Health Status
  try {
    console.log('Fetching Health Status...')
    const healthStatus = await sdk.hyperApiService.ping()
    console.log('Node Ping:', JSON.stringify(healthStatus, null, 2))
  } catch (error) {
    console.error('Failed to fetch Health Status:', error)
  }

  // Testing NAI Transfer with Ed25519 Keytype
  try {
    console.log('Creating Transfer Transaction...')
    // Set the private key for the sender address
    const authFactory = auth.getAuthFactory(
      'ed25519',
      '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7' // private key (as hex string) for nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx
    )
    const txID = await sdk.transactionService.sendTransferTransaction(
      'nuklai1qpxncu2a69l9wyz3yqg4fqn86ys2ll6ja7vhym5qn2vk4cdyvgj2vn4k7wz', // receiver address
      'NAI', // asset ID
      '0.0001', // amount
      'Test Memo', // memo
      authFactory
    )
    console.log('Transaction ID:', txID)
  } catch (error) {
    console.error('Failed to transfer crypto:', error)
  }

  // Testing Create Asset
  try {
    console.log('Creating Asset Transaction...')
    // Set the private key for the sender address
    const authFactory = auth.getAuthFactory(
      'ed25519',
      '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7' // private key (as hex string) for nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx
    )
    const { txID, assetID } =
      await sdk.transactionService.sendCreateAssetTransaction(
        'TEST', // symbol
        1, // decimals
        'Test token', // metadata
        authFactory
      )
    console.log('Transaction ID:', txID)
    console.log('Asset ID:', assetID)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log('Fetching Asset Info...')
    const params = {
      asset: assetID
    }
    const assetInfo = await sdk.assetService.getAssetInfo(params)
    console.log('Newly created Asset:', JSON.stringify(assetInfo, null, 2))
  } catch (error) {
    console.error('Failed to create asset:', error)
  }
}

testSDK()
