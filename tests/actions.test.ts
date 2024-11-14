import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { VMABI } from 'hypersdk-client/dist/Marshaler'
import { NuklaiSDK } from '../src/sdk'

const API_HOST = 'http://127.0.0.1:9650'
const NAI_ASSET_ADDRESS =
  '00cf77495ce1bdbf11e5e45463fad5a862cb6cc0a20e00e658c4ac3355dcdc64bb'
const TEST_ADDRESS =
  '00c4cb545f748a28770042f893784ce85b107389004d6a0e0d6d7518eeae1292d9'
const TEST_ADDRESS2 =
  '002b5d019495996310f81c6a26a4dd9eeb9a3f3be1bac0a9294436713aecc84496'
const TEST_ADDRESS_PRIVATE_KEY =
  '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7'

describe('NuklaiSDK Asset', () => {
  let sdk: NuklaiSDK
  let abi: VMABI
  // Store created asset addresses for later tests
  let ftAddress: string
  let nftAddress: string
  let fractionalAssetAddress: string
  let datasetAddress: string
  let datasetContributionId: string

  beforeAll(async () => {
    try {
      sdk = new NuklaiSDK(API_HOST)

      sdk.rpcService.setSigner(TEST_ADDRESS_PRIVATE_KEY)

      abi = await sdk.rpcService.fetchAbiFromServer()
      console.log(
        'Using ABI with actions:',
        abi.actions.map((action) => action.name)
      )

      const isConnected = await sdk.rpcService.validateConnection()
      if (!isConnected) {
        throw new Error('Failed to connect to VM')
      }
    } catch (error) {
      console.error('Test setup failed:', error)
      throw error
    }
  })

  describe('Basic Connectivity', () => {
    it('should get native token balance', async () => {
      try {
        const balance = await sdk.rpcService.getBalance(TEST_ADDRESS)
        expect(balance).toBeDefined()
        console.log('Native balance:', balance)
      } catch (error) {
        console.error('Balance check failed:', error)
        throw error
      }
    })

    it('should get validator information', async () => {
      const validators = await sdk.rpcService.getAllValidators()
      expect(validators).toBeDefined()
      console.log('Validator count:', validators.length)
    })

    it('should get emission information', async () => {
      const emissionInfo = await sdk.rpcService.getEmissionInfo()
      expect(emissionInfo).toBeDefined()
      console.log('Emission info retrieved')
    })
  })

  describe('Fungible Token Operations', () => {
    it('should create fungible token', async () => {
      try {
        const result = await sdk.rpcService.createFTAsset(
          'Test Token',
          'TEST',
          9,
          generateRandomString(16),
          BigInt('1000000000000000000000000'), // 1M tokens
          TEST_ADDRESS, // mint admin
          TEST_ADDRESS, // pause/unpause admin
          TEST_ADDRESS, // freeze/unfreeze admin
          TEST_ADDRESS // KYC admin
        )

        expect(result).toBeDefined()
        expect(result.result.success).toBe(true);
        expect(result.result).toBeDefined()
        console.log("Transaction ID:", result.txId);

        console.log(
          'Created FT asset: ',
          JSON.stringify(
            result.result.results[0],
            (_, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )
        )
        ftAddress = result.result.results[0].asset_id!;
      } catch (error) {
        console.error('Failed to create FT asset:', error)
        throw error
      }
    })

    it('should mint fungible tokens', async () => {
      try {
        const mintAmount = BigInt('1000000000000000000') // 1 token
        const result = await sdk.rpcService.mintFTAsset(
          TEST_ADDRESS,
          ftAddress,
          mintAmount
        )
        expect(result.result.success).toBe(true);
        console.log("Transaction ID:", result.txId);

        console.log(
          'Minted FT tokens: ',
          JSON.stringify(
            result.result.results[0],
            (_, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )
        )
      } catch (error) {
        console.error('Failed to mint FT tokens:', error)
        throw error
      }
    })

    it('should get FT asset info', async () => {
      try {
        const info = await sdk.rpcService.getAssetInfo(ftAddress)
        expect(info).toBeDefined()
        console.log('FT asset info:', info)
      } catch (error) {
        console.error('Failed to get FT asset info:', error)
        throw error
      }
    })

    it('should transfer fungible tokens', async () => {
      try {
        const transferAmount = BigInt(1) // 1 token
        const result = await sdk.rpcService.transfer(
          TEST_ADDRESS2,
          ftAddress,
          transferAmount,
          'Test transfer'
        )
        expect(result.result.success).toBe(true);
        console.log("Transaction ID:", result.txId);

        console.log(
          'FT transfer complete: ',
          JSON.stringify(
            result.result.results[0],
            (_, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )
        )
      } catch (error) {
        console.error('Failed to transfer FT tokens:', error)
        throw error
      }
    })
  })

  describe('Non-Fungible Token Operations', () => {
    it('should create NFT collection', async () => {
      try {
        const result = await sdk.rpcService.createNFTAsset(
          'Test NFT Collection',
          'TNFT',
          generateRandomString(16),
          BigInt(1000), // max supply
          TEST_ADDRESS,
          TEST_ADDRESS,
          TEST_ADDRESS,
          TEST_ADDRESS
        )
        expect(result.result.success).toBe(true);
        console.log("Transaction ID:", result.txId);

        console.log(
          'Created NFT collection: ',
          JSON.stringify(
            result.result.results[0],
            (_, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )
        )
        nftAddress = result.result.results[0].asset_id!;
      } catch (error) {
        console.error('Failed to create NFT collection:', error)
        throw error
      }
    })

    it('should mint NFT', async () => {
      try {
        const result = await sdk.rpcService.mintNFTAsset(
          nftAddress,
          JSON.stringify({
            name: 'Test NFT #1',
            description: 'First test NFT',
            attributes: []
          }),
          TEST_ADDRESS
        )
        expect(result.result.success).toBe(true);
        console.log("Transaction ID:", result.txId);
        console.log(
          'Minted NFT: ',
          JSON.stringify(
            result.result.results[0],
            (_, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )
        )
      } catch (error) {
        console.error('Failed to mint NFT:', error)
        throw error
      }
    })

    it('should get NFT asset info', async () => {
      try {
        const info = await sdk.rpcService.getAssetInfo(nftAddress)
        expect(info).toBeDefined()
        console.log('NFT asset info retrieved')
      } catch (error) {
        console.error('Failed to get NFT asset info:', error)
        throw error
      }
    })
  })

  describe('Fractional Token Operations', () => {
    it('should create fractional token', async () => {
      try {
        const result = await sdk.rpcService.createFractionalAsset(
          'Test Fractional token',
          'TFRA',
          generateRandomString(16),
          BigInt(1000), // max supply
          TEST_ADDRESS,
          TEST_ADDRESS,
          TEST_ADDRESS,
          TEST_ADDRESS
        )
        expect(result.result.success).toBe(true);
        console.log("Transaction ID:", result.txId);

        console.log(
          'Created Fractional token: ',
          JSON.stringify(
            result.result.results[0],
            (_, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            2
          )
        )
        fractionalAssetAddress = result.result.results[0].asset_id!;
      } catch (error) {
        console.error('Failed to create Fractional token:', error)
        throw error
      }
    })
    it('should get Fractional asset info', async () => {
      try {
        const info = await sdk.rpcService.getAssetInfo(fractionalAssetAddress)
        expect(info).toBeDefined()
        console.log('Fractional asset info retrieved')
      } catch (error) {
        console.error('Failed to get Fractional asset info:', error)
        throw error
      }
    })
  })

  describe('Dataset Operations', () => {
    it('should create dataset', async () => {
      const result = await sdk.rpcService.createDataset(
        fractionalAssetAddress,
        'Test Dataset',
        'A test dataset',
        'AI,Testing',
        'MIT',
        'MIT',
        'https://opensource.org/licenses/MIT',
        JSON.stringify({ format: 'CSV', size: '1GB' }),
        true
      )
      expect(result.result.success).toBe(true);
      console.log("Transaction ID:", result.txId);

      console.log(
        'Created dataset: ',
        JSON.stringify(
          result.result.results[0],
          (_, value) => (typeof value === 'bigint' ? value.toString() : value),
          2
        )
      )
      if (!result.result.results[0].dataset_address) {
        throw new Error('Dataset address not found in result');
      }
      datasetAddress = result.result.results[0].dataset_address;
      expect(datasetAddress).toBe(fractionalAssetAddress)
    })

    it('should initiate dataset contribution', async () => {
      const result = await sdk.rpcService.initiateContributeDataset(
        datasetAddress,
        'ipfs://QmTest...',
        'test-data-001'
      )
      expect(result.result.success).toBe(true);
      console.log("Transaction ID:", result.txId);

      console.log(
        'Initiated dataset contribution: ',
        JSON.stringify(
          result.result.results[0],
          (_, value) => (typeof value === 'bigint' ? value.toString() : value),
          2
        )
      )
      if (!result.result.results[0].dataset_contribution_id) {
        throw new Error('Dataset contribution ID not found in result');
      }
      datasetContributionId = result.result.results[0].dataset_contribution_id;
    })

    it('should complete dataset contribution', async () => {
      const result = await sdk.rpcService.completeContributeDataset(
        datasetContributionId,
        datasetAddress,
        TEST_ADDRESS
      )
      expect(result.result.success).toBe(true);
      console.log("Transaction ID:", result.txId);

      console.log(
        'Completed dataset contribution: ',
        JSON.stringify(
          result.result.results[0],
          (_, value) => (typeof value === 'bigint' ? value.toString() : value),
          2
        )
      )
    })

    it('should get dataset info', async () => {
      const info = await sdk.rpcService.getDatasetInfo(datasetAddress)
      expect(info).toBeDefined()
      console.log('Dataset info retrieved')
    })

    it('should update dataset', async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const result = await sdk.rpcService.updateDataset(
        datasetAddress,
        'Updated Test Dataset',
        'Updated description',
        'AI,Testing,Updated',
        'MIT',
        'MIT',
        'https://opensource.org/licenses/MIT',
        true
      )
      expect(result.result.success).toBe(true);
      console.log("Transaction ID:", result.txId);

      console.log(
        'Updated dataset: ',
        JSON.stringify(
          result.result.results[0],
          (_, value) => (typeof value === 'bigint' ? value.toString() : value),
          2
        )
      )
    })
  })

  describe('Marketplace Operations', () => {
    let marketplaceAssetAddress: string
    it('should publish dataset to marketplace', async () => {
      const result = await sdk.rpcService.publishDatasetToMarketplace(
        datasetAddress,
        NAI_ASSET_ADDRESS, // payment asset
        1000000000 // price per block
      )
      expect(result.result.success).toBe(true);
      console.log("Transaction ID:", result.txId);

      if (!result.result.results[0].marketplace_asset_address) {
        throw new Error('Marketplace asset address not found in result');
      }
      marketplaceAssetAddress = result.result.results[0].marketplace_asset_address;
      console.log('MP Asset Address:', marketplaceAssetAddress)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const getmarketplaceAInfo = await sdk.rpcService.getAssetInfo(
        marketplaceAssetAddress
      )
      console.log('Marketplace Asset Info:', getmarketplaceAInfo)

      console.log(
        'Published dataset to marketplace: ',
        JSON.stringify(
          result.result.results[0],
          (_, value) => (typeof value === 'bigint' ? value.toString() : value),
          2
        )
      )
    })

    it('should subscribe to dataset', async () => {
      const minBlocksToSubscribe = 10 // dataset.GetDatasetConfig().MinBlocksToSubscribe

      const balance = await sdk.rpcService.getBalance(TEST_ADDRESS)
      console.log('NAI Balance before subscribe:', balance)

      await new Promise((resolve) => setTimeout(resolve, 5000))

      const result = await sdk.rpcService.subscribeDatasetMarketplace(
        marketplaceAssetAddress,
        NAI_ASSET_ADDRESS,
        minBlocksToSubscribe
      )
      console.log('Subscribe result:', result)
      expect(result.result.success).toBe(true);
      console.log("Transaction ID:", result.txId);

      console.log(
        'Subscribed to dataset: ',
        JSON.stringify(
          result.result.results[0],
          (_, value) => (typeof value === 'bigint' ? value.toString() : value),
          2
        )
      )
    })

    it('should claim marketplace payment', async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const result = await sdk.rpcService.claimMarketplacePayment(
        marketplaceAssetAddress,
        NAI_ASSET_ADDRESS
      )

      if (result.result.success === false) {
        const info = await sdk.rpcService.getAssetInfo(marketplaceAssetAddress)
        console.log('Marketplace state just before claim failed:', info)
      }
      expect(result.result.success).toBe(true);
      console.log("Transaction ID:", result.txId);

      console.log(
        'Claimed marketplace payment: ',
        JSON.stringify(
          result.result.results[0],
          (_, value) => (typeof value === 'bigint' ? value.toString() : value),
          2
        )
      )
    })
  })

  // Clean up or final verifications
  afterAll(async () => {
    // Verify final states or clean up
    const ftBalance = await sdk.rpcService.getBalance(TEST_ADDRESS)
    console.log('Final FT balance:', ftBalance)
  })
})

// Helper function to generate a random alphanumeric string of specified length
function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
