import { NuklaiSDK } from './dist/index.js'

const sdk = new NuklaiSDK({
  baseApiUrl: 'http://127.0.0.1:9650',
  blockchainId: '2roEcvXxuB2Y95zS2wK5iXrEgE8FXdHEkDgSWUB8LUj7y3deAA'
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

  // Testing NAI Transfer
  try {
    console.log('Creating Transfer Transaction...')
    const transaction =
      await sdk.transactionService.createAndSubmitTransferTransaction(
        'nuklai1qpxncu2a69l9wyz3yqg4fqn86ys2ll6ja7vhym5qn2vk4cdyvgj2vn4k7wz', // receiver address
        'NAI', // asset ID (defaulted to NAI)
        '0.0001', // amount
        'Test Memo', // memo
        '5262814baaa103b3b6fe0f0e0aacdd3a0dffd271dcd5255f737815c1207a59d2' // private key (as hex string) for nuklai1qfgc2st57mmtzet7ajq4lh6d6rp3ev277ejxpandlzzy35v5fnhf6ccx39e
      )
    console.log('Transaction:', transaction)

    console.log('Signing and Sending Transaction...')
    const txId = await sdk.transactionService.signAndSendTransaction(
      '5262814baaa103b3b6fe0f0e0aacdd3a0dffd271dcd5255f737815c1207a59d2', // private key (as hex string)
      transaction
    )
    console.log('Transaction ID:', txId)
  } catch (error) {
    console.error('Failed to transfer crypto:', error)
  }
}

testSDK()
