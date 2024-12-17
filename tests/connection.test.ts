// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { beforeAll, describe, expect, it } from '@jest/globals'
import { VMABI } from 'hypersdk-client/dist/Marshaler'
import { NuklaiSDK, VM_NAME, VM_RPC_PREFIX} from '../src/sdk'
import { TEST_CONFIG } from './config';

const API_HOST = TEST_CONFIG.API_HOST;
const DEMO_ADDRESS = TEST_CONFIG.TEST_ADDRESS;
const TEST_ADDRESS_PRIVATE_KEY = TEST_CONFIG.TEST_PRIVATE_KEY;

describe('NuklaiSDK Basic Functionality', () => {
  let sdk: NuklaiSDK
  let abi: VMABI

  beforeAll(async () => {
    sdk = new NuklaiSDK(API_HOST)

    sdk.rpcService.setSigner(TEST_ADDRESS_PRIVATE_KEY)

    console.log('SDK init using::', {
      apiHost: API_HOST,
      vmName: VM_NAME,
      rpcPrefix: VM_RPC_PREFIX
    })

    abi = (await sdk.rpcService.getAbi()) as VMABI
  })

  it('should connect to the endpoint and retrieve ABI', async () => {
    try {
      console.log('Retrieving ABI...')
      expect(abi).toBeDefined()
      if (
        abi &&
        typeof abi === 'object' &&
        'actions' in abi &&
        'types' in abi
      ) {
        expect(abi.actions).toBeDefined()
        expect(Array.isArray(abi.actions)).toBe(true)
        expect(abi.types).toBeDefined()
        expect(Array.isArray(abi.types)).toBe(true)
        console.log('ABI actions:', abi.actions.length)
        console.log('ABI types:', abi.types.length)
      }
    } catch (error) {
      console.error('testing ABI failed:', error)
      throw error
    }
  }, 30000)

  it('should handle basic balance query', async () => {
    try {
      console.log('Get balance for:', DEMO_ADDRESS)
      const balance = await sdk.rpcService.getBalance(DEMO_ADDRESS)

      expect(balance).toBeDefined()
      console.log('Gotten Balance:', balance)
      expect(typeof balance).toBe('string')
    } catch (error) {
      console.error('Balance query failed:', error)
      throw error
    }
  }, 30000)

  it('should all validators information', async () => {
    try {
      const validators = await sdk.rpcService.getAllValidators()
      expect(validators).toBeDefined()
      console.log('Validators:', validators)
    } catch (error) {
      console.error('Validator query failed:', error)
      throw error
    }
  }, 30000)

  it('should validate connection', async () => {
    try {
      const isConnected = await sdk.rpcService.validateConnection()
      expect(isConnected).toBe(true)
      console.log('Connection validated successfully')
    } catch (error) {
      console.error('Connection validation failed:', error)
      throw error
    }
  }, 30000)
})
