// Default configuration values are maintained here for easy reference and management.
import { SDKConfig } from '../types/SDKConfig'

export const defaultSDKConfig: SDKConfig = {
  baseApiUrl: 'http://127.0.0.1:34575',
  blockchainId: 'YaGWnYQGevYnFJe6mkhWAbB15vHGqq1YZpBLs7ABRFZDMxakN',
  maxRetries: 3,
  initialRetryDelay: 500
}
