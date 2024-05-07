# Nuklai SDK

The Nuklai SDK provides a simplified and modular interface for interacting with the Nuklai blockchain services. It includes methods for fetching health status, blockchain genesis information, transactions, asset details, and managing loans and emissions.

## Features

- **Health Check**: Determine the liveness of the blockchain service.
- **Genesis Information**: Retrieve the genesis block data.
- **Transaction Details**: Fetch information about specific transactions.
- **Asset Information**: Get details about assets on the blockchain and query balance details for a specific account and asset.
- **Loan Management**: Initiate loans between accounts.
- **Emission Information**: Access details about emissions, validators, and stakes.

## Installation

You can install the Nuklai SDK via npm:

```bash
npm install @nuklai/nuklai-js-sdk
```

Or, if you are using Yarn:

```bash
yarn add @nuklai/nuklai-js-sdk
```

## You can also build it locally

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

First, import and configure the SDK:

```javascript
import { NuklaiSDK } from 'nuklai-sdk'

const sdk = new NuklaiSDK({
  baseApiUrl: 'http://127.0.0.1:34575',
  blockchainId: 'YaGWnYQGevYnFJe6mkhWAbB15vHGqq1YZpBLs7ABRFZDMxakN'
})
```

### Fetching Health Status

```javascript
async function checkHealth() {
  try {
    const healthStatus = await sdk.healthService.getHealthStatus()
    console.log('Health Status:', healthStatus)
  } catch (error) {
    console.error('Failed to fetch health status:', error)
  }
}
```

### Getting Genesis Information

```javascript
async function fetchGenesis() {
  try {
    const genesisInfo = await sdk.genesisService.getGenesis()
    console.log('Genesis Info:', genesisInfo)
  } catch (error) {
    console.error('Failed to fetch genesis:', error)
  }
}
```

### Example of Fetching a Balance

```javascript
async function getBalance(address, assetId) {
  try {
    const balance = await sdk.assetService.getBalance(address, assetId)
    console.log('Balance:', balance)
  } catch (error) {
    console.error('Failed to fetch balance:', error)
  }
}
```

## Development

For local development, you can clone the repository and install dependencies:

```bash
git clone https://github.com/Nuklai/nuklai-js-sdk.git
cd nuklai-sdk
npm install
```

## Contributing

Contributions to the Nuklai SDK are welcome! Please ensure that your code adheres to the existing style, and include tests for new features.

## License

This SDK is released under the [MIT License](LICENSE).
