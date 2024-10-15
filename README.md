<p align="center">
  <img width="90%" alt="hypersdk" src="https://i.ibb.co/qMBy03t/Nuklai-SDK.png">
</p>

The Nuklai SDK provides a modular and comprehensive interface for interacting with the Nuklai blockchain. It is designed to facilitate developers with functions ranging from network configurations to transaction management and complex warp operations.

## Features

- **Core and Nuklai API Services**: Separate interfaces for HyperVM (`coreapi`) and NuklaiVM (`nuklaivm`) functionalities.
- **Network Services**: Fetch network settings and last accepted blocks.
- **Health Checks**: Monitor the liveness and connectivity of the blockchain network.
- **Transaction Management**: Submit and fetch details about transactions.
- **Asset Management**: Query and manage blockchain assets.
- **Emission Details**: Access emission information, validator details, and staking functionalities.
- **Asset Management**: Create, mint, and burn fungible tokens, non-fungible tokens (NFTs), and dataset tokens.
- **Balance Checking**: Query balances for both fungible and non-fungible tokens.
- **NFT Information**: Retrieve detailed information about specific NFTs.

## Installation

Install the Nuklai SDK via npm/yarn

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
const healthStatus = await sdk.rpcService.ping()
console.log('Node Ping:', JSON.stringify(healthStatus, null, 2))
```

### Get Network Information

```javascript
const networkInfo = await sdk.rpcService.getNetworkInfo()
console.log('Network Info:', JSON.stringify(networkInfo, null, 2))
```

### Fetch a Balance

```javascript
const params = {
  address: 'nuklai1qpg4ecapjymddcde8sfq06dshzpxltqnl47tvfz0hnkesjz7t0p35d5fnr3',
  asset: 'NAI'
}
const balance = await sdk.rpcServiceNuklai.getBalance(params)
console.log('Balance:', JSON.stringify(balance, null, 2))
```

### Fetch Emission Information

```javascript
const emissionInfo = await sdk.rpcServiceNuklai.getEmissionInfo()
console.log('Emission Info:', JSON.stringify(emissionInfo, null, 2))
```

### Generate Private/Public Key Pair

```javascript
import { NuklaiSDK } from '@nuklai/nuklai-sdk'
import { auth } from '@nuklai/hyperchain-sdk'

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

### Submit a Transaction(via JSON RPC)

```javascript
// Set the private key for the sender address
const authFactory = auth.getAuthFactory(
  'ed25519',
  '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7' // private key (as hex string) for nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx
)
const txID = await sdk.rpcServiceNuklai.sendTransferTransaction(
  'nuklai1qpxncu2a69l9wyz3yqg4fqn86ys2ll6ja7vhym5qn2vk4cdyvgj2vn4k7wz', // receiver address
  'NAI', // asset ID
  '0.0001', // amount
  'Test Memo', // memo
  authFactory,
  sdk.rpcService,
  sdk.actionRegistry,
  sdk.authRegistry
)
console.log('Transaction ID:', txID)
```

### Submit a Transaction(via Websocket)

```javascript
// Set the private key for the sender address
const authFactory = auth.getAuthFactory(
  'ed25519',
  '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7' // private key (as hex string) for nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx
)
await sdk.wsServiceNuklai.connect()
const txID = await sdk.wsServiceNuklai.sendTransferTransactionAndWait(
  'nuklai1qpxncu2a69l9wyz3yqg4fqn86ys2ll6ja7vhym5qn2vk4cdyvgj2vn4k7wz', // receiver address
  'NAI', // asset ID
  '0.0001', // amount
  'Test Memo', // memo
  authFactory,
  sdk.rpcService,
  sdk.actionRegistry,
  sdk.authRegistry
)
await sdk.wsServiceNuklai.close()
console.log('Transaction ID:', txID)
```

### Create a New Asset

```js
const {txID, assetID} = await sdk.rpcServiceNuklai.createAsset(
    'TEST', // symbol
    1, // decimals
    'Test token', // metadata
    authFactory,
    sdk.rpcService,
    sdk.actionRegistry,
    sdk.authRegistry
)
console.log('Create Asset Transaction ID:', txID)
console.log('Asset ID:', assetID)
```

### Mint Asset

```js
const mintAsset = await sdk.rpcServiceNuklai.sendMintAssetTransaction(
  'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx', // receiver address
  assetID, // asset ID
  10, // amount to mint
  authFactory,
  sdk.rpcService,
  sdk.actionRegistry,
  sdk.authRegistry
)
console.log('Mint Transaction ID:', mintAsset)
```

### Listen for blocks(via Websocket)

```js
await sdk.wsServiceNuklai.connect()
const connectAndListen = async () => {
  try {
    const err = await sdk.wsServiceNuklai.registerBlocks()
    if (err) {
      throw err
    }
    const listenBlocks = async () => {
      const { block, results, err } = await sdk.wsServiceNuklai.listenBlock(
        sdk.actionRegistry,
        sdk.authRegistry
      )
      if (err) {
        throw err
      }
      console.log('block: ', block.toJSON())
      results.map((result, i) =>
        console.log(`result at ${i}: ${result.toJSON()}`)
      )
    }
    // Initial block fetch
    listenBlocks()

    // Fetch blocks periodically
    const interval = setInterval(listenBlocks, 3000)

    return () => clearInterval(interval)
  } catch (err) {
    console.error(err)
  }
}
connectAndListen()
await sdk.wsServiceNuklai.close()
```

### Create Different Types of Assets

```javascript
// Create Fungible Token (FT)
const { txID: ftTxID, assetID: ftAssetID } = await sdk.rpcServiceNuklai.sendCreateAssetTransaction(
  ASSET_FUNGIBLE_TOKEN_ID,
  'Fungible Token',
  'FT',
  18,
  'Test Fungible Token',
  'https://example.com/ft',
  BigInt(1000000000000000000000000), // 1 million tokens
  undefined,
  authFactory,
  sdk.rpcService,
  sdk.actionRegistry,
  sdk.authRegistry
)

// Create Non-Fungible Token (NFT)
const { txID: nftTxID, assetID: nftAssetID } = await sdk.rpcServiceNuklai.sendCreateAssetTransaction(
  ASSET_NON_FUNGIBLE_TOKEN_ID,
  'Non-Fungible Token',
  'NFT',
  0,
  'Test Non-Fungible Token',
  'https://example.com/nft',
  BigInt(1000), // 1000 NFTs max
  undefined,
  authFactory,
  sdk.rpcService,
  sdk.actionRegistry,
  sdk.authRegistry
)

// Create Dataset Token
const { txID: datasetTxID, assetID: datasetAssetID } = await sdk.rpcServiceNuklai.sendCreateAssetTransaction(
  ASSET_DATASET_TOKEN_ID,
  'Dataset Token',
  'DT',
  0,
  'Test Dataset Token',
  'https://example.com/dataset',
  BigInt(1),
  'Parent NFT Metadata',
  authFactory,
  sdk.rpcService,
  sdk.actionRegistry,
  sdk.authRegistry
)
```

### Mint Tokens

```javascript
// Mint Fungible Token (FT)
const ftMintTxID = await sdk.rpcServiceNuklai.sendMintAssetTransaction(
  'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
  ftAssetID,
  1000,
  authFactory,
  sdk.rpcService,
  sdk.actionRegistry,
  sdk.authRegistry
)

// Mint Non-Fungible Token (NFT)
const nftMintTxID = await sdk.rpcServiceNuklai.sendMintAssetTransaction(
  'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
  nftAssetID,
  1,
  authFactory,
  sdk.rpcService,
  sdk.actionRegistry,
  sdk.authRegistry
)
```

### Check Token Balances

```javascript
// Check Fungible Token Balance
const ftBalance = await sdk.getFungibleTokenBalance(
  'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
  ftAssetID
)

// Check Non-Fungible Token Balance
const nftBalance = await sdk.getNonFungibleTokenBalance(
  'nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx',
  nftAssetID
)
```

### Get NFT Information

```javascript
const nftInfo = await sdk.getNFTInfo(nftAssetID)
console.log('NFT Info:', nftInfo)
```

### Burn Tokens

```javascript
// Burn Fungible Token (FT)
const ftBurnTxID = await sdk.rpcServiceNuklai.sendBurnAssetFTTransaction(
  ftAssetID,
  100,
  authFactory,
  sdk.rpcService,
  sdk.actionRegistry,
  sdk.authRegistry
)

// Burn Non-Fungible Token (NFT)
const nftBurnTxID = await sdk.rpcServiceNuklai.sendBurnAssetNFTTransaction(
  nftAssetID,
  nftInfo.tokenID,
  authFactory,
  sdk.rpcService,
  sdk.actionRegistry,
  sdk.authRegistry
)
```

## Publish

```bash
npm publish --access public
```

## Contributing

Contributions to the Nuklai SDK are welcome! Please ensure that your code adheres to the existing style, and include tests for new features.

## License

This SDK is released under the [MIT License](LICENSE).

This README file should provide a clear and professional introduction to your SDK, making it easier for developers to understand how to use it and contribute to it.
