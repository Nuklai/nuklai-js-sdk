// test.mjs
import { NuklaiSDK } from './lib/index.js'

const sdk = new NuklaiSDK({
  baseApiUrl: 'http://127.0.0.1:34575',
  blockchainId: 'YaGWnYQGevYnFJe6mkhWAbB15vHGqq1YZpBLs7ABRFZDMxakN'
})

async function testSDK() {
  try {
    console.log('Fetching Health Status...')
    const healthStatus = await sdk.getHealthStatus()
    console.log('Health Status:', JSON.stringify(healthStatus, null, 2))

    console.log('Fetching Genesis...')
    const genesisInfo = await sdk.getGenesis()
    console.log('Genesis Info:', JSON.stringify(genesisInfo, null, 2))

    /*     console.log('Fetching Transaction Info...')
    const transactionInfo = await sdk.getTransaction(
      'transaction_id_placeholder'
    )
    console.log('Transaction Info:',  JSON.stringify(transactionInfo, null, 2))

    console.log('Fetching Asset Info...')
    const assetInfo = await sdk.getAsset('asset_id_placeholder')
    console.log('Asset Info:',  JSON.stringify(assetInfo, null, 2))
    */

    console.log('Fetching Balance...')
    const balance = await sdk.getBalance(
      'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
      '11111111111111111111111111111111LpoYY'
    )
    console.log('Balance:', balance)

    /*     console.log('Creating Loan...')
    const loan = await sdk.createLoan(
      'asset_id_placeholder',
      'destination_id_placeholder'
    )
    console.log('Loan:', loan) */

    console.log('Fetching Emission Info...')
    const emissionInfo = await sdk.getEmissionInfo()
    console.log('Emission Info:', JSON.stringify(emissionInfo, null, 2))

    console.log('Fetching All Validators...')
    const validators = await sdk.getAllValidators()
    console.log('All Validators:', JSON.stringify(validators, null, 2))

    console.log('Fetching Staked Validators...')
    const stakedValidators = await sdk.getStakedValidators()
    console.log('Staked Validators:', JSON.stringify(stakedValidators, null, 2))

    /*     console.log('Fetching Validator Stake...')
    const validatorStake = await sdk.getValidatorStake('node_id_placeholder')
    console.log('Validator Stake:', validatorStake)

    console.log('Fetching User Stake...')
    const userStake = await sdk.getUserStake(
      'owner_address_placeholder',
      'node_id_placeholder'
    )
    console.log('User Stake:', userStake) */
  } catch (error) {
    console.error('SDK Test Failed:', error)
  }
}

testSDK()
