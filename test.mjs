// test.mjs
import { NuklaiSDK } from './dist/index.js'

const sdk = new NuklaiSDK({
  baseApiUrl: 'http://api-devnet.nuklaivm-dev.net:9650',
  blockchainId: 'w4Q3Cu6D3gxB3K2rjLDF64jJaisexo5BoHVJAdadwqvME4RkQ'
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

  // Testing Network Information
  try {
    console.log('Fetching Network Info...')
    const networkInfo = await sdk.hyperApiService.getNetworkInfo()
    console.log('Network Info:', JSON.stringify(networkInfo, null, 2))
  } catch (error) {
    console.error('Failed to fetch Network Info:', error)
  }

  // Testing Genesis Information
  try {
    console.log('Fetching Genesis...')
    const genesisInfo = await sdk.genesisService.getGenesisInfo()
    console.log('Genesis Info:', JSON.stringify(genesisInfo, null, 2))
  } catch (error) {
    console.error('Failed to fetch Genesis:', error)
  }

  // Uncomment these as needed when you have valid IDs to use:
  /*
  // Testing Transaction Information
  try {
    console.log('Fetching Transaction Info...');
    const params = {
      txId: 'transaction_id_placeholder'
    }
    const transactionInfo = await sdk.nuklaiTransactionService.getTransactionInfo();
    console.log('Transaction Info:', JSON.stringify(transactionInfo, null, 2));
  } catch (error) {
    console.error('Failed to fetch Transaction Info:', error);
  }
  */

  // Testing Balance
  try {
    console.log('Fetching Balance...')
    const params = {
      address:
        'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
      asset: '11111111111111111111111111111111LpoYY'
    }
    const balance = await sdk.assetService.getBalance(params)
    console.log('Balance:', JSON.stringify(balance, null, 2))
  } catch (error) {
    console.error('Failed to fetch Balance:', error)
  }
  /*
  // Testing Asset Information
  try {
    console.log('Fetching Asset Info...');
    const params = {
      asset: 'asset_id_placeholder'
    }
    const assetInfo = await sdk.assetService.getAssetInfo(params);
    console.log('Asset Info:', JSON.stringify(assetInfo, null, 2));
  } catch (error) {
    console.error('Failed to fetch Asset Info:', error);
  }
  */

  /*
  // Testing Loan Creation
  try {
    console.log('Creating Loan...');
    const params = {
      destination: 'destination_id_placeholder',
      asset: 'asset_id_placeholder',
    }
    const loan = await sdk.loanService.getLoanInfo(params);
    console.log('Loan:', JSON.stringify(loan, null, 2));
  } catch (error) {
    console.error('Failed to create Loan:', error);
  }
  */

  // Testing Emission Information
  try {
    console.log('Fetching Emission Info...')
    const emissionInfo = await sdk.emissionService.getEmissionInfo()
    console.log('Emission Info:', JSON.stringify(emissionInfo, null, 2))
  } catch (error) {
    console.error('Failed to fetch Emission Info:', error)
  }

  // Testing All Validators
  try {
    console.log('Fetching All Validators...')
    const validators = await sdk.emissionService.getAllValidators()
    console.log('All Validators:', JSON.stringify(validators, null, 2))
  } catch (error) {
    console.error('Failed to fetch All Validators:', error)
  }

  // Testing Staked Validators
  try {
    console.log('Fetching Staked Validators...')
    const stakedValidators = await sdk.emissionService.getStakedValidators()
    console.log('Staked Validators:', JSON.stringify(stakedValidators, null, 2))
  } catch (error) {
    console.error('Failed to fetch Staked Validators:', error)
  }

  /*
  // Testing Validator Stake
  try {
    console.log('Fetching Validator Stake...');
    const params = {
      nodeID: 'node_id_placeholder'
    }
    const validatorStake = await sdk.emissionService.getValidatorStake(params);
    console.log('Validator Stake:', JSON.stringify(validatorStake, null, 2));
  } catch (error) {
    console.error('Failed to fetch Validator Stake:', error);
  }

  // Testing User Stake
  try {
    console.log('Fetching User Stake...');
    const params = {
      owner: 'owner_address_placeholder',
      nodeID: 'node_id_placeholder'
    }
    const userStake = await sdk.emissionService.getUserStake(params);
    console.log('User Stake:', JSON.stringify(userStake, null, 2));
  } catch (error) {
    console.error('Failed to fetch User Stake:', error);
  }
  */
}

testSDK()
