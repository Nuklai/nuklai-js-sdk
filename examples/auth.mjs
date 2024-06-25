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

  // Testing BLS Key Generation and Signing
  try {
    console.log('Generating BLS Key Pair...')
    const { privateKey, publicKey } = sdk.blsAuthFactory.generateKeyPair()
    console.log(
      'Generated BLS Private Key:',
      sdk.blsAuthFactory.privateKeyToHex(privateKey)
    )
    console.log(
      'Generated BLS Public Key:',
      sdk.blsAuth.publicKeyToHex(publicKey)
    )

    const blsAuthFactory = new sdk.blsAuthFactory(privateKey)
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
    const { privateKey, publicKey } = sdk.ed25519AuthFactory.generateKeyPair()
    console.log(
      'Generated ED25519 Private Key:',
      sdk.ed25519AuthFactory.privateKeyToHex(privateKey)
    )
    console.log(
      'Generated ED25519 Public Key:',
      sdk.ed25519Auth.publicKeyToHex(publicKey)
    )

    const ed25519AuthFactory = new sdk.ed25519AuthFactory(privateKey)
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
