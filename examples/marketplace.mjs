// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { auth } from '@nuklai/hyperchain-sdk'
import { NuklaiSDK } from '../dist/index.esm.js'

const sdk = new NuklaiSDK({
    baseApiUrl: 'http://api-devnet.nuklaivm-dev.net:9650',
    blockchainId: '24h7hzFfHG2vCXtT1MKsxP1VkYb9kkKHAvhJim1Xb7Y6W15zY5'
})

const privateKey = '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7'
const authFactory = auth.getAuthFactory('ed25519', privateKey)

async function testSDK() {
    console.log('Starting Marketplace tests...')

    try {
        // Publish Dataset to Marketplace
        console.log('Publishing Dataset to Marketplace...')
        const publishResult = await sdk.rpcServiceNuklai.publishDatasetToMarketplace(
            'datasetID123',
            'NAI',
            BigInt(1000000000000000000), // 1 NAI
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Dataset published to marketplace:', publishResult)

        // Get Dataset Info from Marketplace
        console.log('Getting Dataset Info from Marketplace...')
        const marketplaceInfo = await sdk.rpcServiceNuklai.getDatasetInfoFromMarketplace('datasetID123')
        console.log('Marketplace Dataset Info:', marketplaceInfo)

        // Subscribe to Dataset in Marketplace
        console.log('Subscribing to Dataset in Marketplace...')
        const subscribeTxID = await sdk.rpcServiceNuklai.subscribeDatasetMarketplace(
            'datasetID123',
            'marketplaceAssetID123',
            'NAI',
            BigInt(100), // number of blocks to subscribe
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Subscription Transaction ID:', subscribeTxID)

        // Claim Marketplace Payment
        console.log('Claiming Marketplace Payment...')
        const claimTxID = await sdk.rpcServiceNuklai.claimMarketplacePayment(
            'datasetID123',
            'marketplaceAssetID123',
            'NAI',
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Claim Payment Transaction ID:', claimTxID)

    } catch (error) {
        console.error('Error during Marketplace operations:', error)
    }
}

testSDK()