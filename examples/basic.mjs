// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { NuklaiSDK } from '../dist/index.js'

const sdk = new NuklaiSDK({
  baseApiUrl: 'http://127.0.0.1:9650',
  blockchainId: 'PHsV1a1Vjaqc6V4pcZH5AhrBuoHyhygebGKJDfvT7ZWqdH8TN'
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

  // Testing Network Information
  try {
    console.log('Fetching Network Info...')
    const networkInfo = await sdk.hyperApiService.getNetworkInfo()
    console.log('Network Info:', JSON.stringify(networkInfo, null, 2))
  } catch (error) {
    console.error('Failed to fetch Network Info:', error)
  }

  // Testing Genesis Information
  try {
    console.log('Fetching Genesis...')
    const genesisInfo = await sdk.genesisService.getGenesisInfo()
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
    const balance = await sdk.assetService.getAssetInfo(params)
    console.log('Asset Info:', JSON.stringify(balance, null, 2))
  } catch (error) {
    console.error('Failed to fetch Asset info:', error)
  }

  // Testing Balance
  try {
    console.log('Fetching Balance...')
    const params = {
      address:
        'nuklai1qpg4ecapjymddcde8sfq06dshzpxltqnl47tvfz0hnkesjz7t0p35d5fnr3',
      asset: 'NAI' // or any other asset ID
    }
    const balance = await sdk.assetService.getBalance(params)
    console.log('Balance:', JSON.stringify(balance, null, 2))
  } catch (error) {
    console.error('Failed to fetch Balance:', error)
  }
}

testSDK()
