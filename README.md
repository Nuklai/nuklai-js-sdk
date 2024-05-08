# Nuklai SDK

The Nuklai SDK provides a modular and comprehensive interface for interacting with both the HyperVM and NuklaiVM on the Nuklai blockchain. It is designed to facilitate developers with functions ranging from network configurations to transaction management and complex warp operations.

## Features

- **Core and Nuklai API Services**: Separate interfaces for HyperVM (`coreapi`) and NuklaiVM (`nuklaivm`) functionalities.
- **Network Services**: Fetch network settings and last accepted blocks.
- **Health Checks**: Monitor the liveness and connectivity of the blockchain network.
- **Transaction Management**: Submit and fetch details about transactions.
- **Asset Management**: Query and manage blockchain assets.
- **Loan Services**: Handle creation and management of loans.
- **Emission Details**: Access emission information, validator details, and staking functionalities.
- **Warp Protocol Services**: Manage and fetch warp signatures and related operations.

## Installation

Install the Nuklai SDK via npm(NOTE: Currently does not work so need to build locally):

````bash
npm install @nuklai/nuklai-sdk

Or, if you are using Yarn:

```bash
yarn add @nuklai/nuklai-sdk
````

## Build from source

```bash
npm install
npm run build
```

## Run the test.mjs file

This file contains an example code on how to use the SDK in your own application.

```bash
node test.mjs
```

## Usage

Import and initialize the SDK in your project:

```javascript
import { NuklaiSDK } from 'nuklai-sdk'

const sdk = new NuklaiSDK({
  baseApiUrl: 'http://127.0.0.1:34575', // Node API URL
  blockchainId: 'YaGWnYQGevYnFJe6mkhWAbB15vHGqq1YZpBLs7ABRFZDMxakN' // Blockchain ID
})
```

## Example Usage

### Check Health Status

```javascript
async function checkHealth() {
  const healthStatus = await sdk.healthService.ping()
  console.log('Health Status:', healthStatus)
}
```

### Get Network Information

```javascript
async function fetchNetworkInfo() {
  const networkInfo = await sdk.networkService.getNetworkInfo()
  console.log('Network Info:', networkInfo)
}
```

### Fetch a Balance

```javascript
async function getBalance(address, assetId) {
  const balance = await sdk.assetService.getBalance(address, assetId)
  console.log('Balance:', balance)
}
```

### Fetch Emission Information

```javascript
async function fetchEmissionDetails() {
  const emissionInfo = await sdk.emissionService.getEmissionInfo()
  console.log('Emission Details:', emissionInfo)
}
```

### Submit a Transaction

```javascript
async function submitTransaction(txData) {
  const transactionReceipt =
    await sdk.hyperTransactionService.submitTransaction(txData)
  console.log('Transaction Receipt:', transactionReceipt)
}
```

## Contributing

Contributions to the Nuklai SDK are welcome! Please ensure that your code adheres to the existing style, and include tests for new features.

## License

This SDK is released under the [MIT License](LICENSE).
