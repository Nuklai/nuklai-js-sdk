// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { auth } from '@nuklai/hyperchain-sdk'
import { NuklaiSDK } from '../dist/index.esm.js'
import { ASSET_NON_FUNGIBLE_TOKEN_ID } from '../dist/constants/nuklaivm.js'

const sdk = new NuklaiSDK({
    baseApiUrl: 'http://api-devnet.nuklaivm-dev.net:9650',
    blockchainId: '24h7hzFfHG2vCXtT1MKsxP1VkYb9kkKHAvhJim1Xb7Y6W15zY5'
})

const privateKey = '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7'
const authFactory = auth.getAuthFactory('ed25519', privateKey)

async function testSDK() {
    console.log('Starting Non-Fungible Token Operations tests...')

    try {
        // Create Non-Fungible Token
        console.log('Creating Non-Fungible Token...')
        const { txID: nftTxID, assetID: nftAssetID } = await sdk.rpcServiceNuklai.createAsset(
            ASSET_NON_FUNGIBLE_TOKEN_ID,
            'Non-Fungible Token',
            'NFT',
            0,
            'Test Non-Fungible Token',
            'https://nukl.ai/nft',
            BigInt(1000), // 1000 NFTs max
            undefined,
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Non-Fungible Token created. TxID:', nftTxID, 'AssetID:', nftAssetID)

        // Mint Non-Fungible Token
        console.log('Minting Non-Fungible Token...')
        const nftMintTxID = await sdk.rpcServiceNuklai.mintNFTAsset(
            'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
            nftAssetID,
            1,
            'https://nukl.ai/nft/1',
            'Metadata for NFT #1',
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Non-Fungible Token minted. TxID:', nftMintTxID)

        // Check Non-Fungible Token Balance
        console.log('Checking Non-Fungible Token Balance...')
        const nftBalance = await sdk.rpcServiceNuklai.getNonFungibleTokenBalance({
            address: 'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
            asset: nftAssetID
        })
        console.log('Non-Fungible Token Balance:', nftBalance)

        // Get NFT Info
        console.log('Getting NFT Info...')
        const nftInfo = await sdk.rpcServiceNuklai.getNFTInfo({ nftID: nftAssetID })
        console.log('NFT Info:', nftInfo)

        // Transfer Non-Fungible Token
        console.log('Transferring Non-Fungible Token...')
        const transferTxID = await sdk.rpcServiceNuklai.transferNFT(
            'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
            nftAssetID,
            nftInfo.tokenID,
            'Test NFT transfer',
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Non-Fungible Token transferred. TxID:', transferTxID)

        // Burn Non-Fungible Token
        console.log('Burning Non-Fungible Token...')
        const nftBurnTxID = await sdk.rpcServiceNuklai.burnNFTAsset(
            nftAssetID,
            nftInfo.tokenID,
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Non-Fungible Token burned. TxID:', nftBurnTxID)

    } catch (error) {
        console.error('Error during Non-Fungible Token operations:', error)
    }
}

testSDK()