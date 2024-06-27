# Nuklai SDK

The Nuklai SDK provides a modular and comprehensive interface for interacting with the Nuklai blockchain. It is designed to facilitate developers with functions ranging from network configurations to transaction management and complex warp operations.

## Features

- **Core and Nuklai API Services**: Separate interfaces for HyperVM (`coreapi`) and NuklaiVM (`nuklaivm`) functionalities.
- **Network Services**: Fetch network settings and last accepted blocks.
- **Health Checks**: Monitor the liveness and connectivity of the blockchain network.
- **Transaction Management**: Submit and fetch details about transactions.
- **Asset Management**: Query and manage blockchain assets.
- **Emission Details**: Access emission information, validator details, and staking functionalities.

## Installation

Install the Nuklai SDK via npm/yarn (NOTE: Currently does not work, so you need to build it locally):

```bash
npm install @nuklai/nuklai-sdk
# or
yarn add @nuklai/nuklai-sdk
```

## Build from Source

To build the SDK from source:

```bash
yarn
yarn build
```

## Examples

The [examples directory](./examples) contains various example code to interact with the Nuklai SDK.

## Usage

Import and initialize the SDK in your project:

```javascript
import { NuklaiSDK } from '@nuklai/nuklai-sdk'

const sdk = new NuklaiSDK({
  baseApiUrl: 'http://127.0.0.1:9650', // Node API URL
  blockchainId: 'CuH4wPFDk6p1jSRPMcJPgt9nGFfF7zfRrH3nkJW2TWLfRE53L' // Blockchain ID
})
```

## Example Usage

### Check Health Status

```javascript
const healthStatus = await sdk.hyperApiService.ping()
console.log('Node Ping:', JSON.stringify(healthStatus, null, 2))
```

### Get Network Information

```javascript
const networkInfo = await sdk.hyperApiService.getNetworkInfo()
console.log('Network Info:', JSON.stringify(networkInfo, null, 2))
```

### Fetch a Balance

```javascript
const params = {
  address: 'nuklai1qpg4ecapjymddcde8sfq06dshzpxltqnl47tvfz0hnkesjz7t0p35d5fnr3',
  asset: 'NAI'
}
const balance = await sdk.assetService.getBalance(params)
console.log('Balance:', JSON.stringify(balance, null, 2))
```

### Fetch Emission Information

```javascript
const emissionInfo = await sdk.emissionService.getEmissionInfo()
console.log('Emission Info:', JSON.stringify(emissionInfo, null, 2))
```

### Generate Private/Public Key Pair

```javascript
import { NuklaiSDK, auth } from '@nuklai/nuklai-sdk'
const { privateKey, publicKey } = auth.ED25519Factory.generateKeyPair()
console.log(
  'Generated ED25519 Private Key:',
  auth.ED25519Factory.privateKeyToHex(privateKey)
)
console.log(
  'Generated ED25519 Public Key:',
  auth.ED25519.publicKeyToHex(publicKey)
)
```

### Submit a Transaction

```javascript
// Set the private key for the sender address
const authFactory = auth.getAuthFactory(
  'ed25519',
  '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7' // private key (as hex string) for nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx
)
const txID = await sdk.transactionService.sendTransferTransaction(
  'nuklai1qpxncu2a69l9wyz3yqg4fqn86ys2ll6ja7vhym5qn2vk4cdyvgj2vn4k7wz', // receiver address
  'NAI', // asset ID
  '0.0001', // amount
  'Test Memo', // memo
  authFactory
)
console.log('Transaction ID:', txID)
```

## Contributing

Contributions to the Nuklai SDK are welcome! Please ensure that your code adheres to the existing style, and include tests for new features.

## License

This SDK is released under the [MIT License](LICENSE).

This README file should provide a clear and professional introduction to your SDK, making it easier for developers to understand how to use it and contribute to it.
