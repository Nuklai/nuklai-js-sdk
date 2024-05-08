// test.mjs
import { NuklaiSDK } from './dist/index.js'

const sdk = new NuklaiSDK({
  baseApiUrl: 'http://127.0.0.1:33477',
  blockchainId: '2FYCHk5Vs43Jz1fMsaUba2F4fPjWwcS7ftj8ncNZ8JRgNi9BE3'
})

async function testSDK() {
  console.log('Starting SDK tests...')

  // Testing Health Status
  try {
    console.log('Fetching Health Status...')
    const healthStatus = await sdk.healthService.ping()
    console.log('Node Ping:', JSON.stringify(healthStatus, null, 2))
  } catch (error) {
    console.error('Failed to fetch Health Status:', error)
  }

  // Testing Network Information
  try {
    console.log('Fetching Network Info...')
    const networkInfo = await sdk.networkService.getNetworkInfo()
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
    const transactionInfo = await sdk.nuklaiTransactionService.getTransactionInfo('transaction_id_placeholder');
    console.log('Transaction Info:', JSON.stringify(transactionInfo, null, 2));
  } catch (error) {
    console.error('Failed to fetch Transaction Info:', error);
  }

  // Testing Asset Information
  try {
    console.log('Fetching Asset Info...');
    const assetInfo = await sdk.assetService.getAssetInfo('asset_id_placeholder');
    console.log('Asset Info:', JSON.stringify(assetInfo, null, 2));
  } catch (error) {
    console.error('Failed to fetch Asset Info:', error);
  }
  */

  // Testing Balance
  try {
    console.log('Fetching Balance...')
    const balance = await sdk.assetService.getBalance(
      'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
      '11111111111111111111111111111111LpoYY'
    )
    console.log('Balance:', JSON.stringify(balance, null, 2))
  } catch (error) {
    console.error('Failed to fetch Balance:', error)
  }

  /*
  // Testing Loan Creation
  try {
    console.log('Creating Loan...');
    const loan = await sdk.loanService.getLoanInfo('asset_id_placeholder', 'destination_id_placeholder');
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
    const validatorStake = await sdk.emissionService.getValidatorStake('node_id_placeholder');
    console.log('Validator Stake:', JSON.stringify(validatorStake, null, 2));
  } catch (error) {
    console.error('Failed to fetch Validator Stake:', error);
  }

  // Testing User Stake
  try {
    console.log('Fetching User Stake...');
    const userStake = await sdk.emissionService.getUserStake('owner_address_placeholder', 'node_id_placeholder');
    console.log('User Stake:', JSON.stringify(userStake, null, 2));
  } catch (error) {
    console.error('Failed to fetch User Stake:', error);
  }
  */
}

testSDK()
