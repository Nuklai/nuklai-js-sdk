# Nuklai SDK

<div align="center">
  <img width="90%" alt="hypersdk" src="https://i.ibb.co/qMBy03t/Nuklai-SDK.png">

  <p>A modular interface for interacting with the Nuklai blockchain, built on top of the <a href="https://github.com/ava-labs/hypersdk">Avalanche HyperSDK</a>.</p>
</div>

## 📦 Installation

```bash
npm install @nuklai/nuklai-sdk
# or
yarn add @nuklai/nuklai-sdk
```

## 🚀 Quick Start

```javascript
import { NuklaiSDK } from "@nuklai/nuklai-sdk";

const sdk = new NuklaiSDK("http://127.0.0.1:9650");
const healthStatus = await sdk.rpcService.validateConnection();
```

## ✨ Core Features

- 💰 Asset Management (Fungible/Non-Fungible Tokens)
- 📊 Dataset Creation and Management
- 🏪 Marketplace Operations
- 💳 Transaction Management
- 🔍 Network Status and Health Checks
- 🏛️ Validator Management
- 📈 Staking Operations

## 📖 Basic Usage

### Initialization

```javascript
import { NuklaiSDK } from "@nuklai/nuklai-sdk";

const sdk = new NuklaiSDK({
  baseApiUrl: "http://127.0.0.1:9650",
});

// Set the signer for transactions
sdk.rpcService.setSigner("your-private-key-here");
```

### Wallet Generation

```javascript
// Create SDK instance
const sdk = new NuklaiSDK();

// Create a new random wallet
const wallet = sdk.createWallet();
console.log("Wallet address:", wallet.getAddress());

// Or import an existing wallet
const importedWallet = sdk.importWalletFromPrivateKey("your-private-key-hex");

// Check wallet connection
if (sdk.isWalletConnected()) {
    // Use wallet features
    const address = sdk.getAddress();
}
```

### Signer

```typescript
// Using a private key string (old way)
await sdk.rpcService.setSigner(privateKeyString);

// Using a wallet's signer (new way)
await sdk.rpcService.setSigner(wallet.getSigner());

// Using any custom signer that implements SignerIface
await sdk.rpcService.setSigner(customSigner);

```

### Asset Management

```javascript
// Create a fungible token
const ftResult = await sdk.rpcService.createFTAsset(
  "Test Token",
  "TEST",
  9,
  "metadata",
  BigInt("1000000000000000000"), // Max supply
  "owner-address",
  "admin-address",
  "admin-address",
  "admin-address"
);

// Create an NFT collection
const nftResult = await sdk.rpcService.createNFTAsset(
  "Test NFT",
  "TNFT",
  "metadata",
  BigInt(1000), // Max supply
  "owner-address",
  "admin-address",
  "admin-address",
  "admin-address"
);
```

### Token Operations

```javascript
// Mint fungible tokens
const mintAmount = BigInt("1000000000000000000"); // 1 token
const mintResult = await sdk.rpcService.mintFTAsset(
  "receiver-address",
  "token-address",
  mintAmount
);

// Mint NFT
const nftMintResult = await sdk.rpcService.mintNFTAsset(
  "nft-collection-address",
  JSON.stringify({
    name: "Test NFT #1",
    description: "First NFT",
    attributes: [],
  }),
  "receiver-address"
);

// Transfer tokens
const transferAmount = BigInt("100000000000000000"); // 0.1 token
const transferResult = await sdk.rpcService.transfer(
  "recipient-address",
  "token-address",
  transferAmount,
  "Transfer memo"
);
```

### Check Address Balance

```javascript
// Get native NAI token balance
const nativeBalance = await sdk.rpcService.getBalance("address");

// Get any asset balance by passing asset address
const assetBalance = await sdk.rpcService.getBalance("address", "assetAddress");;
```

> NOTE: Balance is returned as raw strings without decimal formatting. Use asset decimals info from `getAssetInfo()` to correctly format & display the balance corectly.

### Dataset Operations

```javascript
// Create a dataset
const result = await sdk.rpcService.createDataset(
  "asset-address",
  "Test Dataset",
  "Description",
  "AI,Testing",
  "MIT",
  "MIT",
  "https://opensource.org/licenses/MIT",
  "metadata",
  true // isCommunityDataset
);
```

## 🛠️ Development

Build from source:

```bash
yarn
yarn build
```

Run tests:

```bash
yarn test
```

## 📝 Examples

The `examples/` directory contains sample implementations:

```plaintext
examples/
├── datasets.ts            # Dataset creation and management
├── fungible-tokens.ts     # Fungible Token operations
├── non-fungible-tokens.ts # Non-Fungible Token operations
└── marketplace.ts         # Marketplace interactions
```

You can run all examples at once using:

```bash
yarn examples
```

Or run individual examples:

```bash
ts-node --esm examples/fungible-tokens.ts
ts-node --esm examples/non-fungible-tokens.ts
```

## 📚 API Reference

All methods are accessible through the `sdk.rpcService` instance. Below is a comprehensive reference of available methods grouped by their functionality.

### Network Operations

| Method                      | Description                   | Parameters       | Returns                 |
| --------------------------- | ----------------------------- | ---------------- | ----------------------- |
| `validateConnection()`      | Checks node connectivity      | None             | `Promise<boolean>`      |
| `getEmissionInfo()`         | Retrieves emission statistics | None             | `Promise<ActionOutput>` |
| `getAllValidators()`        | Lists all validators          | None             | `Promise<ActionOutput>` |
| `getStakedValidators()`     | Lists validators with stake   | None             | `Promise<ActionOutput>` |
| `getValidatorStake(nodeID)` | Gets specific validator stake | `nodeID: string` | `Promise<ActionOutput>` |

### Asset Management

#### Fungible Token Methods

| Method            | Description                | Parameters                                                                                                                                                                                                            | Returns             |
| ----------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `createFTAsset()` | Creates a new Fungible Token | - `name: string`<br>- `symbol: string`<br>- `decimals: number`<br>- `metadata: string`<br>- `maxSupply: bigint`<br>- `mintAdmin: string`<br>- `pauseAdmin: string`<br>- `freezeAdmin: string`<br>- `kycAdmin: string` | `Promise<TxResult>` |
| `mintFTAsset()`   | Mints Fungible Tokens               | - `to: string`<br>- `assetAddress: string`<br>- `amount: bigint`                                                                                                                                                      | `Promise<TxResult>` |
| `transfer()`      | Transfers tokens           | - `to: string`<br>- `assetAddress: string`<br>- `value: bigint`<br>- `memo: string`                                                                                                                                   | `Promise<TxResult>` |

#### Non-Fungible Token Methods

| Method             | Description            | Parameters                                                                                                                                                                                    | Returns             |
| ------------------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `createNFTAsset()` | Creates an NFT collection | - `name: string`<br>- `symbol: string`<br>- `metadata: string`<br>- `maxSupply: bigint`<br>- `mintAdmin: string`<br>- `pauseAdmin: string`<br>- `freezeAdmin: string`<br>- `kycAdmin: string` | `Promise<TxResult>` |
| `mintNFTAsset()`   | Mints a new NFT          | - `assetAddress: string`<br>- `metadata: string`<br>- `to: string`                                                                                                                            | `Promise<TxResult>` |

### Dataset & Marketplace Operations

#### Dataset Methods

| Method             | Description          | Parameters                                                                                                                                                                                                                                     | Returns                 |
| ------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `createDataset()`  | Creates a new dataset  | - `assetAddress: string`<br>- `name: string`<br>- `description: string`<br>- `categories: string`<br>- `licenseName: string`<br>- `licenseSymbol: string`<br>- `licenseURL: string`<br>- `metadata: string`<br>- `isCommunityDataset: boolean` | `Promise<TxResult>`     |
| `updateDataset()`  | Updates dataset info | - `datasetAddress: string`<br>- `name: string`<br>- `description: string`<br>- `categories: string`<br>- `licenseName: string`<br>- `licenseSymbol: string`<br>- `licenseURL: string`<br>- `isCommunityDataset: boolean`                       | `Promise<TxResult>`     |
| `getDatasetInfo()` | Gets dataset details | `datasetID: string`                                                                                                                                                                                                                            | `Promise<ActionOutput>` |

#### Marketplace Methods

| Method                          | Description                  | Parameters                                                                                                 | Returns             |
| ------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------- |
| `publishDatasetToMarketplace()` | Lists dataset on marketplace | - `datasetAddress: string`<br>- `paymentAssetAddress: string`<br>- `datasetPricePerBlock: number`          | `Promise<TxResult>` |
| `subscribeDatasetMarketplace()` | Subscribes to dataset        | - `marketplaceAssetAddress: string`<br>- `paymentAssetAddress: string`<br>- `numBlocksToSubscribe: number` | `Promise<TxResult>` |
| `claimMarketplacePayment()`     | Claims marketplace earnings  | - `marketplaceAssetAddress: string`<br>- `paymentAssetAddress: string`                                     | `Promise<TxResult>` |

### Query Methods

| Method                      | Description                 | Parameters                                 | Returns                 |
| --------------------------- | --------------------------- | ------------------------------------------ | ----------------------- |
| `getBalance()`              | Get's address balance        | `address: string`                          | `Promise<string>`       |
| `getAssetInfo()`            | Get's asset details          | `assetAddress: string`                     | `Promise<ActionOutput>` |
| `getDatasetBalance()`       | Get's dataset balance        | - `address: string`<br>- `assetID: string` | `Promise<ActionOutput>` |
| `getDatasetNFTInfo()`       | Get's NFT details            | `nftID: string`                            | `Promise<ActionOutput>` |
| `getPendingContributions()` | Lists pending contributions | `datasetID: string`                        | `Promise<ActionOutput>` |

### Usage Example

Creating and minting a fungible token

```typescript
// Create a FT
const ftResult = await sdk.rpcService.createFTAsset(
  "Test Token",
  "TEST",
  9,
  "metadata",
  BigInt("1000000000000000000"),
  "owner-address",
  "admin-address",
  "admin-address",
  "admin-address"
);

// After creation, mint some tokens
const mintResult = await sdk.rpcService.mintFTAsset(
  "receiver-address",
  ftResult.result[0].asset_id,
  BigInt("1000000000000000000")
);
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
