import { NuklaiSDK } from '../src/sdk'
import {
  API_HOST,
  generateRandomString,
  NAI_ASSET_ADDRESS,
  TEST_ADDRESS,
  TEST_ADDRESS2,
  TEST_ADDRESS_PRIVATE_KEY
} from './utils'

async function fungibleTokenEx() {
  // Initialize SDK with proper endpoint
  const sdk = new NuklaiSDK(API_HOST)

  console.log('Using address:', TEST_ADDRESS)
  sdk.rpcService.setSigner(TEST_ADDRESS_PRIVATE_KEY)

  try {
    // Test basic connectivity and get ABI
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

    // Transfer tokens
    console.log('Transferring tokens...')
    const transferAmount = BigInt(1) // 1 token
    const transferTxResult = await sdk.rpcService.transfer(
      TEST_ADDRESS2,
      NAI_ASSET_ADDRESS,
      transferAmount,
      'Test transfer'
    )

    if (!transferTxResult.success) {
      throw new Error(
        `Failed to transfer tokens: ${JSON.stringify(transferTxResult)}`
      )
    }
    console.log('Transfer completed successfully')

    // Create a new fungible token using CreateAsset action
    console.log('Creating fungible token...')
    const createTxResult = await sdk.rpcService.createFTAsset(
      'Test Token',
      'TEST',
      9,
      generateRandomString(16),
      BigInt('1000000000000000000000000'), // Max supply
      TEST_ADDRESS,
      TEST_ADDRESS,
      TEST_ADDRESS,
      TEST_ADDRESS
    )

    if (!createTxResult.success) {
      throw new Error(
        `Failed to create token: ${JSON.stringify(createTxResult)}`
      )
    }

    const assetAddress = createTxResult.result[0].asset_id
    console.log('Token created with address:', assetAddress)

    // Get asset info to verify creation
    const assetInfo = await sdk.rpcService.getAssetInfo(assetAddress)
    console.log('Asset info:', assetInfo)

    // Mint tokens
    console.log('Minting tokens...')
    const mintAmount = BigInt('1000000000000000000') // 1 token
    const mintTxResult = await sdk.rpcService.mintFTAsset(
      TEST_ADDRESS, // to
      assetAddress,
      mintAmount
    )

    if (!mintTxResult.success) {
      throw new Error(`Failed to mint tokens: ${JSON.stringify(mintTxResult)}`)
    }
    console.log('Tokens minted successfully')

    // Get final balances
    const finalBalance = await sdk.rpcService.getBalance(TEST_ADDRESS)
    console.log('Final NAI balance:', finalBalance)
    const finalAssetInfo = await sdk.rpcService.getAssetInfo(assetAddress)
    console.log('Final asset info:', finalAssetInfo)
  } catch (error) {
    console.error('Error in fungible token operations:', error)
    if (error instanceof Error) {
      console.error('- Message:', error.message)
      console.error('- Stack:', error.stack)
    } else {
      console.error('Unknown error:', error)
    }
    throw error
  }
}

export { fungibleTokenEx }
