// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { auth } from '@nuklai/hyperchain-sdk'
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

  // Testing BLS Key Generation and Signing
  try {
    console.log('Generating BLS Key Pair...')
    const { privateKey, publicKey } = auth.BLSFactory.generateKeyPair()
    console.log(
      'Generated BLS Private Key:',
      auth.BLSFactory.privateKeyToHex(privateKey)
    )
    console.log('Generated BLS Public Key:', auth.BLS.publicKeyToHex(publicKey))

    const blsAuthFactory = new auth.BLSFactory(privateKey)
    const message = new TextEncoder().encode('Test message')
    const blsAuth = blsAuthFactory.sign(message)
    console.log(
      'Signature:',
      Buffer.from(blsAuth.signature.toRawBytes()).toString('hex')
    )

    const isValid = await blsAuth.verify(message)
    console.log('Signature valid:', isValid)

    const address = blsAuth.address().toString()
    console.log('Generated Address:', address)
  } catch (error) {
    console.error('Failed to generate BLS Key Pair:', error)
  }

  // Testing ED25519 Key Generation and Signing
  try {
    console.log('Generating ED25519 Key Pair...')
    const { privateKey, publicKey } = auth.ED25519Factory.generateKeyPair()
    console.log(
      'Generated ED25519 Private Key:',
      auth.ED25519Factory.privateKeyToHex(privateKey)
    )
    console.log(
      'Generated ED25519 Public Key:',
      auth.ED25519.publicKeyToHex(publicKey)
    )

    const ed25519AuthFactory = new auth.ED25519Factory(privateKey)
    const message = new TextEncoder().encode('Test message')
    const ed25519Auth = await ed25519AuthFactory.sign(message)
    console.log(
      'Signature:',
      Buffer.from(ed25519Auth.signature).toString('hex')
    )

    const isValid = await ed25519Auth.verify(message)
    console.log('Signature valid:', isValid)

    const address = ed25519Auth.address().toString()
    console.log('Generated Address:', address)
  } catch (error) {
    console.error('Failed to generate ED25519 Key Pair:', error)
  }
}

testSDK()
