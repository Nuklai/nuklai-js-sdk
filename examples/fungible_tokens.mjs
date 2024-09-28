// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { auth } from '@nuklai/hyperchain-sdk'
import { NuklaiSDK } from '../dist/index.esm.js'
import { ASSET_FUNGIBLE_TOKEN_ID } from '../dist/constants/nuklaivm.js'

const sdk = new NuklaiSDK({
    baseApiUrl: 'http://api-devnet.nuklaivm-dev.net:9650',
    blockchainId: '24h7hzFfHG2vCXtT1MKsxP1VkYb9kkKHAvhJim1Xb7Y6W15zY5'
})

const privateKey = '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7'
const authFactory = auth.getAuthFactory('ed25519', privateKey)

async function testSDK() {
    console.log('Starting Fungible Token Operations tests...')

    try {
        // Create Fungible Token
        console.log('Creating Fungible Token...')
        const { txID: ftTxID, assetID: ftAssetID } = await sdk.rpcServiceNuklai.createAsset(
            ASSET_FUNGIBLE_TOKEN_ID,
            'Fungible Token',
            'FT',
            18,
            'Test Fungible Token',
            'https://nukl.ai/ft',
            BigInt(1000000000000000000000000), // 1 million tokens
            undefined,
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Fungible Token created. TxID:', ftTxID, 'AssetID:', ftAssetID)

        // Mint Fungible Token
        console.log('Minting Fungible Token...')
        const ftMintTxID = await sdk.rpcServiceNuklai.mintFTAsset(
            'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
            ftAssetID,
            1000,
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Fungible Token minted. TxID:', ftMintTxID)

        // Check Fungible Token Balance
        console.log('Checking Fungible Token Balance...')
        const ftBalance = await sdk.rpcServiceNuklai.getFungibleTokenBalance({
            address: 'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
            asset: ftAssetID
        })
        console.log('Fungible Token Balance:', ftBalance)

        // Get Asset Info
        console.log('Getting Asset Info...')
        const assetInfo = await sdk.rpcServiceNuklai.getAssetInfo({
            asset: ftAssetID
        })
        console.log('Asset Info:', assetInfo)

        // Transfer Fungible Token
        console.log('Transferring Fungible Token...')
        const transferTxID = await sdk.rpcServiceNuklai.transfer(
            'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
            ftAssetID,
            100,
            'Test transfer',
            undefined,
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Fungible Token transferred. TxID:', transferTxID)

        // Burn Fungible Token
        console.log('Burning Fungible Token...')
        const ftBurnTxID = await sdk.rpcServiceNuklai.burnFTAsset(
            ftAssetID,
            100,
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Fungible Token burned. TxID:', ftBurnTxID)

    } catch (error) {
        console.error('Error during Fungible Token operations:', error)
    }
}

testSDK()
