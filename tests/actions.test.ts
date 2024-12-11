// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { VMABI } from 'hypersdk-client/dist/Marshaler'
import { Block } from 'hypersdk-client/dist/apiTransformers'
import { TransactionResult } from '../src/client'
import { NuklaiSDK } from '../src'
import { TEST_CONFIG } from './config';

const API_HOST = TEST_CONFIG.API_HOST;
const NAI_ASSET_ADDRESS = TEST_CONFIG.NAI_ASSET_ADDRESS;
const TEST_ADDRESS = TEST_CONFIG.TEST_ADDRESS;
const TEST_ADDRESS2 = TEST_CONFIG.TEST_ADDRESS2;
const TEST_ADDRESS_PRIVATE_KEY = TEST_CONFIG.TEST_PRIVATE_KEY;

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
      const balance = await sdk.rpcService.getBalance(TEST_ADDRESS);
      expect(balance).toBeDefined();
      expect(typeof balance).toBe('string');
      expect(BigInt(balance)).toBeGreaterThan(0);
      console.log('Raw Native balance:', balance);
    });

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
        expect(result.result.success).toBe(true)
        expect(result.result).toBeDefined()

        console.log('Created FT asset:', logTxResult(result))
        ftAddress = result.result.results[0].asset_address!
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
        expect(result.result.success).toBe(true)

        console.log('Minted FT tokens: ', logTxResult(result))
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

    it('should get asset balance', async () => {
      const balance = await sdk.rpcService.getBalance(TEST_ADDRESS, ftAddress);
      expect(balance).toBeDefined();
      expect(typeof balance).toBe('string');
      expect(BigInt(balance)).toBe(BigInt('1000000000000000000'));
      console.log('Raw Asset balance:', balance);
    });

    it('should transfer fungible tokens', async () => {
      try {
        const transferAmount = BigInt(1) // 1 token
        const result = await sdk.rpcService.transfer(
          TEST_ADDRESS2,
          ftAddress,
          transferAmount,
          'Test transfer'
        )
        expect(result.result.success).toBe(true)

        console.log('FT transfer complete: ', logTxResult(result))
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
        expect(result.result.success).toBe(true)

        console.log('Created NFT collection: ', logTxResult(result))
        nftAddress = result.result.results[0].asset_address!
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
        expect(result.result.success).toBe(true)
        console.log('Minted NFT: ', logTxResult(result))
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
        expect(result.result.success).toBe(true)

        console.log('Created Fractional token: ', logTxResult(result))
        fractionalAssetAddress = result.result.results[0].asset_address!
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
      expect(result.result.success).toBe(true)

      console.log('Created dataset: ', logTxResult(result))
      if (!result.result.results[0].dataset_address) {
        throw new Error('Dataset address not found in result')
      }
      datasetAddress = result.result.results[0].dataset_address
      expect(datasetAddress).toBe(fractionalAssetAddress)
    })

    it('should initiate dataset contribution', async () => {
      const result = await sdk.rpcService.initiateContributeDataset(
        datasetAddress,
        'ipfs://QmTest...',
        'test-data-001'
      )
      expect(result.result.success).toBe(true)

      console.log('Initiated dataset contribution: ', logTxResult(result))
      if (!result.result.results[0].dataset_contribution_id) {
        throw new Error('Dataset contribution ID not found in result')
      }
      datasetContributionId = result.result.results[0].dataset_contribution_id
    })

    it('should complete dataset contribution', async () => {
      const result = await sdk.rpcService.completeContributeDataset(
        datasetContributionId,
        datasetAddress,
        TEST_ADDRESS
      )
      expect(result.result.success).toBe(true)

      console.log('Completed dataset contribution: ', logTxResult(result))
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
      expect(result.result.success).toBe(true)

      console.log('Updated dataset: ', logTxResult(result))
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
      expect(result.result.success).toBe(true)

      console.log('Published dataset: ', logTxResult(result))

      if (!result.result.results[0].marketplace_asset_address) {
        throw new Error('Marketplace asset address not found in result')
      }
      marketplaceAssetAddress =
        result.result.results[0].marketplace_asset_address
      console.log('MP Asset Address:', marketplaceAssetAddress)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const getmarketplaceAInfo = await sdk.rpcService.getAssetInfo(
        marketplaceAssetAddress
      )
      console.log('Marketplace Asset Info:', getmarketplaceAInfo)
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
      expect(result.result.success).toBe(true)

      console.log('Subscribed to dataset: ', logTxResult(result))
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
      expect(result.result.success).toBe(true)

      console.log('Claimed marketplace payment: ', logTxResult(result))
    })
  })

  // Clean up or final verifications
  afterAll(async () => {
    // Verify final states or clean up
    const ftbalance = await sdk.rpcService.getBalance(TEST_ADDRESS)
    expect(ftbalance).toBeDefined();
    expect(typeof ftbalance).toBe('string');
    console.log('Raw Final balance:', ftbalance);
  });
})

describe('Listening for Blocks', () => {
  let sdk: NuklaiSDK
  let abi: VMABI
  let unsubscribe: Promise<() => void> | null = null

  beforeAll(async () => {
    try {
      sdk = new NuklaiSDK(API_HOST)
      sdk.rpcService.setSigner(TEST_ADDRESS_PRIVATE_KEY)
      abi = await sdk.rpcService.fetchAbiFromServer()
      
      const isConnected = await sdk.rpcService.validateConnection()
      if (!isConnected) {
        throw new Error('Failed to connect')
      }
    } catch (error) {
      console.error('Test failed:', error)
      throw error
    }
  })

  describe('Block Subscription', () => {
    // Clean up after each test
    afterEach(async () => {
      if (unsubscribe) {
        const unsub = await unsubscribe
        unsub()
        unsubscribe = null
      }
    })

    it('should successfully subscribe to blocks', async () => {
      try {
        const receivedBlocks: Block[] = []
        
        await new Promise<void>(async (resolve, reject) => {
          const unsub = await sdk.listenToBlocks((block: Block) => {
            console.log('Received block:', {
              height: block.block.height,
              timestamp: block.block.timestamp,
              txCount: block.block.txs.length
            })
            receivedBlocks.push(block)
            if (receivedBlocks.length >= 2) {
              resolve()
            }
          }, true)
          unsubscribe = Promise.resolve(unsub)
        })

        expect(receivedBlocks.length).toBeGreaterThanOrEqual(2)
        expect(receivedBlocks[0].blockID).toBeDefined()
        expect(receivedBlocks[0].block.height).toBeGreaterThan(0)
        
        console.log('Successfully subscribed to block')
      } catch (error) {
        console.error('Block subscription test failed:', error)
        throw error
      }
    }, 35000)

    it('should handle block with transaction', async () => {
      try {
        const txPromise = new Promise<Block>(async (resolve) => {
          const unsub = await sdk.listenToBlocks((block: Block) => {
            if (block.block.txs.length > 0) {
              resolve(block)
            }
          }, true)
          unsubscribe = Promise.resolve(unsub)
        })

        const result = await sdk.rpcService.transfer(
          TEST_ADDRESS2,
          NAI_ASSET_ADDRESS,
          BigInt(1),
          'Test transfer'
        )
        expect(result.result.success).toBe(true)

        const blockWithTx = await txPromise
        expect(blockWithTx.block.txs.length).toBeGreaterThan(0)
        
        console.log('Successfully verified transaction in block:', {
          blockHeight: blockWithTx.block.height,
          txCount: blockWithTx.block.txs.length
        })
      } catch (error) {
        console.error('Transaction block test failed:', error)
        throw error
      }
    }, 35000)

    it('should handle unsubscribe', async () => {
      try {
        let blockCount = 0
        const unsub = await sdk.listenToBlocks(() => {
          blockCount++
        }, true)

        await new Promise(resolve => setTimeout(resolve, 2000))
        unsub()

        expect(blockCount).toBeGreaterThan(0)
        console.log('Successfully unsubscribe from block')
      } catch (error) {
        console.error('Unsubscribe test failed:', error)
        throw error
      }
    }, 5000)
  })

  afterAll(async () => {
    if (unsubscribe) {
      const unsub = await unsubscribe
      unsub()
    }
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

export function logTxResult(r: TransactionResult) {
  const result = r.result
  return {
    txId: r.txId,
    result: {
      timestamp: new Date(result.timestamp).toISOString(),
      success: result.success,
      sponsor: result.sponsor,
      units: {
        bandwidth: result.units.bandwidth,
        compute: result.units.compute,
        storage_read: result.units.storageRead, // Note snake_case
        storage_allocate: result.units.storageAllocate,
        storage_write: result.units.storageWrite
      },
      fee: result.fee,
      input: JSON.stringify(result.input, bigIntReplacer),
      results: JSON.stringify(result.results, bigIntReplacer)
    }
  }
}

export function bigIntReplacer(_key: string, value: any): any {
  return typeof value === 'bigint' ? value.toString() : value
}
