import { datasetEx } from './dataset.ts'
import { fungibleTokenEx } from './fungible_tokens.ts'
import { marketplaceEx } from './marketplace.js'
import { nonFungibleTokenEx } from './non_fungible_token.ts'
import { verifyEndpoint } from './utils.ts'

const API_ENDPOINT = 'http://127.0.0.1:9650'

async function runAllExamples() {
  try {
    // First verify the endpoint
    console.log('Verifying API endpoint...')
    const verification = await verifyEndpoint(API_ENDPOINT)

    if (!verification.isValid) {
      console.error('API endpoint verification failed:', verification.details)
      console.log('\nPlease verify:')
      console.log('1. The endpoint URL is correct')
      console.log('2. The endpoint is accessible')
      console.log('3. Any required headers or authentication')
      return
    }

    console.log('API endpoint verified successfully!')

    console.log('\nRunning FT examples...')
    await fungibleTokenEx().catch((error) => {
      console.error('FT examples failed:', error)
    })

    console.log('\nRunning NFT examples...')
    await nonFungibleTokenEx().catch((error) => {
      console.error('NFT examples failed:', error)
    })

    console.log('\nRunning Dataset examples...')
    await datasetEx().catch((error) => {
      console.error('Dataset examples failed:', error)
    })

    console.log('\nRunning Marketplace examples...')
    await marketplaceEx().catch((error) => {
      console.error('Marketplace examples failed:', error)
    })
  } catch (error) {
    console.error('Error running examples:', error)
    process.exit(1)
  }
}

// Add proper debugging information
const DEBUG = true

if (DEBUG) {
  process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason)
  })
}

console.log('Starting examples with endpoint:', API_ENDPOINT)
runAllExamples()
  .then(() => {
    console.log('Examples completed!')
  })
  .catch(console.error)
