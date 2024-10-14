// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { auth } from '@nuklai/hyperchain-sdk'
import { NuklaiSDK } from '../dist/index.esm.js'
import { ASSET_DATASET_TOKEN_ID } from '../dist/constants/nuklaivm.js'

const sdk = new NuklaiSDK({
    baseApiUrl: 'http://api-devnet.nuklaivm-dev.net:9650',
    blockchainId: '24h7hzFfHG2vCXtT1MKsxP1VkYb9kkKHAvhJim1Xb7Y6W15zY5'
})

const privateKey = '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7'
const authFactory = auth.getAuthFactory('ed25519', privateKey)

async function testSDK() {
    console.log('Starting Dataset Operations tests...')

    try {
        // Create Dataset
        console.log('Creating Dataset...')
        const { txID: datasetTxID, datasetID, assetID: datasetAssetID, nftID } = await sdk.rpcServiceNuklai.createDataset(
            'Test Dataset',
            'DATASET',
            'Test Dataset Description',
            'Bitcoin, Dataset, btc',
            'MIT License',
            'MIT',
            'https://opensource.org/licenses/MIT',
            'Test Dataset Metadata',
            true, // isCommunityDataset
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Dataset created. TxID:', datasetTxID, 'DatasetID:', datasetID, 'AssetID:', datasetAssetID, 'NFTID:', nftID)

        // Get Dataset Info
        console.log('Getting Dataset Info...')
        const datasetInfo = await sdk.rpcServiceNuklai.getDatasetInfo({ datasetID })
        console.log('Dataset Info:', datasetInfo)

        // Get Dataset Asset Info
        console.log('Getting Dataset Asset Info...')
        const datasetAssetInfo = await sdk.rpcServiceNuklai.getDatasetAssetInfo(datasetAssetID)
        console.log('Dataset Asset Info:', datasetAssetInfo)

        // Get Dataset Balance
        console.log('Getting Dataset Balance...')
        const datasetBalance = await sdk.rpcServiceNuklai.getDatasetBalance({
            address: 'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
            assetID: datasetAssetID
        })
        console.log('Dataset Balance:', datasetBalance)

        // Get Dataset NFT Info
        console.log('Getting Dataset NFT Info...')
        const datasetNFTInfo = await sdk.rpcServiceNuklai.getDatasetNFTInfo({ nftID })
        console.log('Dataset NFT Info:', datasetNFTInfo)

        // Update Dataset
        console.log('Updating Dataset...')
        const updateDatasetTxID = await sdk.rpcServiceNuklai.updateDataset(
            datasetID,
            'Updated Test Dataset',
            'Updated Test Dataset Description',
            'Bitcoin, Dataset, btc',
            'Apache License 2.0',
            'Apache-2.0',
            'https://opensource.org/licenses/Apache-2.0',
            'Updated Test Dataset Metadata',
            true, // isCommunityDataset
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Dataset updated. TxID:', updateDatasetTxID)

        // Get Full Dataset Info
        console.log('Getting Full Dataset Info...')
        const fullDatasetInfo = await sdk.rpcServiceNuklai.getFullDatasetInfo(datasetID)
        console.log('Full Dataset Info:', fullDatasetInfo)

        // Get Pending Contributions
        console.log('Getting Pending Contributions....');
        const pendingContributions = await sdk.rpcServiceNuklai.getPendingContributions(datasetID)
        console.log('Pending Contributions: ', pendingContributions);

        // Initiate Contribute Dataset
        console.log('Initiating Dataset Contribution...')
        const initiateContributeResult = await sdk.rpcServiceNuklai.initiateContributeDataset(
            datasetID,
            'dataLocation123',
            'dataIdentifier123',
            'NAI',
            BigInt(1000000000000000000), // 1 NAI as collateral
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Initiate Contribute Result:', initiateContributeResult)

        // Complete Contribute Dataset
        console.log('Completing Dataset Contribution...')
        const completeContributeResult = await sdk.rpcServiceNuklai.completeContributeDataset(
            datasetID,
            'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
            BigInt(1),
            'NAI',
            BigInt(1000000000000000000), // 1 NAI as collateral
            'dataLocation123',
            'dataIdentifier123',
            authFactory,
            sdk.rpcService,
            sdk.actionRegistry,
            sdk.authRegistry
        )
        console.log('Complete Contribute Result:', completeContributeResult)

    } catch (error) {
        console.error('Error during Dataset operations:', error)
    }
}

testSDK()