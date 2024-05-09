// Default configuration values are maintained here for easy reference and management.
import {
  MAINNET_PUBLIC_API_BASE_URL,
  NUKLAI_CHAIN_ID
} from '../constants/endpoints'
import { SDKConfig } from '../types/SDKConfig'

export const defaultSDKConfig: SDKConfig = {
  baseApiUrl: MAINNET_PUBLIC_API_BASE_URL,
  blockchainId: NUKLAI_CHAIN_ID
}
