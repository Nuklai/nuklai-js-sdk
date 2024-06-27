// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { NuklaiSDK, auth } from './dist/index.js'

const sdk = new NuklaiSDK({
  baseApiUrl: 'http://127.0.0.1:9650',
  blockchainId: 'L7XnbAsnfnVj8Kfr7XPCyHuuEF74abTbJMxTFgbdLUHg5aNoy'
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

  // Testing Create Asset
  try {
    console.log('Creating Asset Transaction...')
    // Set the private key for the sender address
    const authFactory = auth.getAuthFactory(
      'ed25519',
      '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7' // private key (as hex string) for nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx
    )
    let { txID, assetID } =
      await sdk.transactionService.sendCreateAssetTransaction(
        'TEST', // symbol
        1, // decimals
        'Test token', // metadata
        authFactory
      )
    console.log('Create Asset Transaction ID:', txID)
    console.log('Asset ID:', assetID)
    await new Promise((resolve) => setTimeout(resolve, 5000))
    console.log('Fetching Asset Info...')
    let params = {
      asset: assetID
    }
    let assetInfo = await sdk.assetService.getAssetInfo(params)
    console.log('Newly created Asset:', JSON.stringify(assetInfo, null, 2))

    console.log('Minting Asset...')
    txID = await sdk.transactionService.sendMintAssetTransaction(
      'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx', // receiver address
      assetID, // asset ID
      10, // amount to mint
      authFactory
    )
    console.log('Mint Asset Transaction ID:', txID)
    await new Promise((resolve) => setTimeout(resolve, 5000))
    console.log('Fetching Asset Info...')
    params = {
      asset: assetID
    }
    assetInfo = await sdk.assetService.getAssetInfo(params)
    console.log('Newly minted Asset:', JSON.stringify(assetInfo, null, 2))
  } catch (error) {
    console.error('Failed to create & mint asset:', error)
  }
}

testSDK()
