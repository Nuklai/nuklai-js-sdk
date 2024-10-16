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

  // Testing Emission Information
  try {
    console.log('Fetching Emission Info...')
    const emissionInfo = await sdk.rpcServiceNuklai.getEmissionInfo()
    console.log('Emission Info:', JSON.stringify(emissionInfo, null, 2))
  } catch (error) {
    console.error('Failed to fetch Emission Info:', error)
  }
}

testSDK()
