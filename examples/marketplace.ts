import { NuklaiSDK } from '../src/sdk'
import {
  API_HOST,
  generateRandomString,
  logTxResult,
  NAI_ASSET_ADDRESS,
  TEST_ADDRESS,
  TEST_ADDRESS_PRIVATE_KEY
} from './utils'

async function marketplaceEx() {
  // Initialize SDK with proper endpoint
  const sdk = new NuklaiSDK(API_HOST)

  console.log('Using address:', TEST_ADDRESS)
  sdk.rpcService.setSigner(TEST_ADDRESS_PRIVATE_KEY)

  try {
    // Check connectivity and ABI
    console.log('Testing basic connectivity...')
    const abi = await sdk.rpcService.fetchAbiFromServer().catch((error) => {
      console.error('Failed to get ABI:', error)
      throw new Error('Basic connectivity test failed')
    })
    console.log(
      'Connected successfully. Available actions:',
      abi.actions.map((a) => a.name)
    )

    // Check balance before operations
    const initialBalance = await sdk.rpcService.getBalance(TEST_ADDRESS)
    console.log('Initial balance:', initialBalance)

    // This is only possible when rpc creates endpoint for faucet request.
    // const minRequired = "2000000000"; // 2 NAI (need more for marketplace operations)
    // if (parseFloat(initialBalance) < parseFloat(minRequired)) {
    //     console.log("Requesting test tokens...");
    //     await sdk.rpcService.requestTestTokens(address);
    //     await new Promise(resolve => setTimeout(resolve, 5000));
    //     const newBalance = await sdk.rpcService.getBalance(address);
    //     console.log("Balance after faucet:", newBalance);
    //
    //     if (parseFloat(newBalance) < parseFloat(minRequired)) {
    //         throw new Error("Insufficient balance for marketplace operations");
    //     }
    // }

    // Create a new fractional token using CreateAsset action
    console.log('Creating fractional token...')
    const createFracAssetTxResult = await sdk.rpcService.createFractionalAsset(
      'Test Fractional token',
      'TFRA',
      generateRandomString(16),
      BigInt(1000), // max supply
      TEST_ADDRESS,
      TEST_ADDRESS,
      TEST_ADDRESS,
      TEST_ADDRESS
    )

    if (!createFracAssetTxResult.result.success) {
      throw new Error(
        `Failed to create token: ${JSON.stringify(createFracAssetTxResult)}`
      )
    }

    const assetAddress = createFracAssetTxResult.result.results[0].asset_address
    console.log(
      'Fractional Token created:',
      logTxResult(createFracAssetTxResult)
    )

    // Get asset info to verify creation
    const assetInfo = await sdk.rpcService.getAssetInfo(assetAddress)
    console.log('Asset info:', assetInfo)

    // Create dataset
    console.log('Creating dataset...')
    const datasetMetadata = {
      format: 'CSV',
      size: '1GB',
      schema: {
        fields: [
          { name: 'field1', type: 'string' },
          { name: 'field2', type: 'number' }
        ]
      }
    }

    const createTxResult = await sdk.rpcService.createDataset(
      assetAddress,
      'Test Dataset',
      'A test dataset with comprehensive metadata',
      'AI,Testing,Example',
      'MIT',
      'MIT',
      'https://opensource.org/licenses/MIT',
      JSON.stringify(datasetMetadata),
      true // community dataset
    )

    if (!createTxResult.result.success) {
      throw new Error(
        `Failed to create dataset: ${JSON.stringify(createTxResult)}`
      )
    }

    const datasetAddress = createTxResult.result.results[0].dataset_address // Note snake_case
    console.log('Dataset created:', logTxResult(createTxResult))

    // Get dataset info to verify creation
    const datasetInfo = await sdk.rpcService.getDatasetInfo(datasetAddress)
    console.log('Dataset info:', datasetInfo)

    // Publish dataset to marketplace
    console.log('Publishing dataset to marketplace...')
    const publishTxResult = await sdk.rpcService.publishDatasetToMarketplace(
      datasetAddress,
      NAI_ASSET_ADDRESS, // payment asset address
      1000000000 // price per block
    )

    if (!publishTxResult.result.success) {
      throw new Error(
        `Failed to publish dataset to marketplace: ${JSON.stringify(
          publishTxResult
        )}`
      )
    }

    const marketplaceAssetId =
      publishTxResult.result.results[0].marketplace_asset_address
    console.log('Published dataset:', logTxResult(publishTxResult))

    // Subscribe to dataset
    console.log('Subscribing to dataset...')
    const minBlocksToSubscribe = 10 // dataset.GetDatasetConfig().MinBlocksToSubscribe
    const subscribeTxResult = await sdk.rpcService.subscribeDatasetMarketplace(
      marketplaceAssetId,
      NAI_ASSET_ADDRESS, // payment asset address
      minBlocksToSubscribe // number of blocks
    )

    if (!subscribeTxResult.result.success) {
      throw new Error(
        `Failed to subscribe to dataset: ${JSON.stringify(subscribeTxResult)}`
      )
    }

    const subscriptionNftAddress =
      subscribeTxResult.result.results[0].subscription_nft_address
    console.log('Subscription complete:', logTxResult(subscribeTxResult))

    // Get subscription NFT info
    const subscriptionInfo = await sdk.rpcService.getAssetInfo(
      subscriptionNftAddress
    )
    console.log('Subscription NFT info:', subscriptionInfo)

    // Wait a few blocks before claiming payment
    console.log('Waiting for blocks to accumulate...')
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Claim marketplace payment
    console.log('Claiming marketplace payment...')
    const claimTxResult = await sdk.rpcService.claimMarketplacePayment(
      marketplaceAssetId,
      NAI_ASSET_ADDRESS // payment asset address
    )

    if (!claimTxResult.result.success) {
      throw new Error(
        `Failed to claim marketplace payment: ${JSON.stringify(claimTxResult)}`
      )
    }

    console.log('Payment claimed:', logTxResult(claimTxResult))

    // Get final balances and info
    const finalBalance = await sdk.rpcService.getBalance(TEST_ADDRESS)
    console.log('Final NAI balance:', finalBalance)
    const finalDatasetInfo = await sdk.rpcService.getDatasetInfo(datasetAddress)
    console.log('Final dataset info:', finalDatasetInfo)
  } catch (error) {
    console.error('Error in marketplace operations:', error)
    if (error instanceof Error) {
      console.error('- Message:', error.message)
      console.error('- Stack:', error.stack)
    } else {
      console.error('Unknown error:', error)
    }
    throw error
  }
}

export { marketplaceEx }
