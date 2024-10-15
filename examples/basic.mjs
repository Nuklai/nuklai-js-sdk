// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { NuklaiSDK } from '../dist/index.esm.js'

const sdk = new NuklaiSDK({
  baseApiUrl: 'http://api-devnet.nuklaivm-dev.net:9650',
  blockchainId: '24h7hzFfHG2vCXtT1MKsxP1VkYb9kkKHAvhJim1Xb7Y6W15zY5'
})

async function testSDK() {
  console.log('Starting SDK tests...')

  // Testing Health Status
  try {
    console.log('Fetching Health Status...')
    const healthStatus = await sdk.rpcService.ping()
    console.log('Node Ping:', JSON.stringify(healthStatus, null, 2))
  } catch (error) {
    console.error('Failed to fetch Health Status:', error)
  }

  // Testing Network Information
  try {
    console.log('Fetching Network Info...')
    const networkInfo = await sdk.rpcService.getNetworkInfo()
    console.log('Network Info:', JSON.stringify(networkInfo, null, 2))
  } catch (error) {
    console.error('Failed to fetch Network Info:', error)
  }

  // Testing Genesis Information
  try {
    console.log('Fetching Genesis...')
    const genesisInfo = await sdk.rpcServiceNuklai.getGenesisInfo()
    console.log('Genesis Info:', JSON.stringify(genesisInfo, null, 2))
  } catch (error) {
    console.error('Failed to fetch Genesis:', error)
  }

  // Testing Asset
  try {
    console.log('Fetching Asset Info...')
    const params = {
      asset: 'NAI' // or any other asset ID
    }
    const assetInfo = await sdk.rpcServiceNuklai.getAssetInfo(params)
    console.log('Asset Info:', JSON.stringify(assetInfo, null, 2))
  } catch (error) {
    console.error('Failed to fetch Asset info:', error)
  }

  // Testing Balance
  try {
    console.log('Fetching Balance...')
    const params = {
      address:
        'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
      asset: 'NAI' // or any other asset ID
    }
    const balance = await sdk.rpcServiceNuklai.getBalance(params)
    console.log('Balance:', JSON.stringify(balance, null, 2))
  } catch (error) {
    console.error('Failed to fetch Balance:', error)
  }
}

testSDK()
