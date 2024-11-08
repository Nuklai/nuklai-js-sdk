import { TxResult } from 'hypersdk-client/dist/apiTransformers'
import { NuklaiSDK } from '../src/sdk'
import {
  API_HOST,
  generateRandomString,
  TEST_ADDRESS,
  TEST_ADDRESS_PRIVATE_KEY
} from './utils'

async function datasetEx() {
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
    // const minRequired = "1000000000"; // 1 NAI
    // if (parseFloat(initialBalance) < parseFloat(minRequired)) {
    //     console.log("Requesting test tokens...");
    //     await sdk.rpcService.requestTestTokens(address);
    //     await new Promise(resolve => setTimeout(resolve, 5000));
    //     const newBalance = await sdk.rpcService.getBalance(address);
    //     console.log("Balance after faucet:", newBalance);
    //
    //     if (parseFloat(newBalance) < parseFloat(minRequired)) {
    //         throw new Error("Insufficient balance for transactions");
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

    if (!createFracAssetTxResult.success) {
      throw new Error(
        `Failed to create token: ${JSON.stringify(createFracAssetTxResult)}`
      )
    }

    const assetAddress = createFracAssetTxResult.result[0].asset_id
    console.log('Token created with address:', assetAddress)

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

    if (!createTxResult.success) {
      throw new Error(
        `Failed to create dataset: ${JSON.stringify(createTxResult)}`
      )
    }

    const datasetAddress = createTxResult.result[0].dataset_address // Note snake_case
    console.log('Dataset created:', {
      address: datasetAddress,
      transactionDetails: logTxResult(createTxResult)
    })

    // Get dataset info to verify creation
    const datasetInfo = await sdk.rpcService.getDatasetInfo(datasetAddress)
    console.log('Dataset info:', datasetInfo)

    // Initiate contribution
    console.log('Initiating dataset contribution...')
    const dataLocation = 'ipfs://QmExample...'
    const dataIdentifier = `test-data-${Date.now()}`

    const initiateTxResult = await sdk.rpcService.initiateContributeDataset(
      datasetAddress,
      dataLocation,
      dataIdentifier
    )

    if (!initiateTxResult.success) {
      throw new Error(
        `Failed to initiate dataset contribution: ${JSON.stringify(
          initiateTxResult
        )}`
      )
    }

    const contributionId = initiateTxResult.result[0].dataset_contribution_id // Note snake_case
    console.log('Contribution initiated:', {
      contributionId,
      transactionDetails: logTxResult(initiateTxResult)
    })

    // Complete contribution
    console.log('Completing dataset contribution...')
    const completeTxResult = await sdk.rpcService.completeContributeDataset(
      contributionId,
      datasetAddress,
      TEST_ADDRESS // contributor address
    )

    if (!completeTxResult.success) {
      throw new Error(
        `Failed to complete dataset contribution: ${JSON.stringify(
          completeTxResult
        )}`
      )
    }

    console.log('Contribution completed:', {
      details: completeTxResult.result[0],
      transactionDetails: logTxResult(completeTxResult)
    })

    // Get final dataset info
    const finalDatasetInfo = await sdk.rpcService.getDatasetInfo(datasetAddress)
    console.log('Final dataset info:', finalDatasetInfo)

    // Get final balance
    const finalBalance = await sdk.rpcService.getBalance(TEST_ADDRESS)
    console.log('Final NAI balance:', finalBalance)
  } catch (error) {
    console.error('Error in dataset operations:', error)
    if (error instanceof Error) {
      console.error('- Message:', error.message)
      console.error('- Stack:', error.stack)
    } else {
      console.error('Unknown error:', error)
    }
    throw error
  }
}

function logTxResult(result: TxResult) {
  return {
    success: result.success,
    timestamp: new Date(result.timestamp).toISOString(),
    fee: result.fee,
    units: {
      bandwidth: result.units.bandwidth,
      compute: result.units.compute,
      storage_read: result.units.storageRead, // Note snake_case
      storage_allocate: result.units.storageAllocate,
      storage_write: result.units.storageWrite
    }
  }
}

export { datasetEx }
