import { NuklaiSDK, MAINNET_PUBLIC_API_BASE_URL } from "../src/sdk.js";
import { PrivateKeySigner } from "hypersdk-client/dist/PrivateKeySigner.js";
import { TxResult } from "hypersdk-client/dist/apiTransformers.js";

async function marketplaceEx() {
    // Initialize SDK with proper endpoint
    const sdk = new NuklaiSDK(MAINNET_PUBLIC_API_BASE_URL);

    // Set up signer and get address
    const signer = new PrivateKeySigner(new Uint8Array(32));
    const address = Buffer.from(signer.getPublicKey()).toString('hex');
    console.log("Using address:", address);
    
    await sdk.rpcService.setSigner(signer);

    try {
        // Check connectivity and ABI
        console.log("Testing basic connectivity...");
        const abi = await sdk.rpcService.fetchAbiFromServer().catch(error => {
            console.error("Failed to get ABI:", error);
            throw new Error("Basic connectivity test failed");
        });
        console.log("Connected successfully. Available actions:", abi.actions.map(a => a.name));

        // Check balance before operations
        const initialBalance = await sdk.rpcService.getBalance(address);
        console.log("Initial balance:", initialBalance);

        // This is only possible when rpc creates endpoint for faucet request.
        // const minRequired = "2000000000"; // 2 NAI (need more for marketplace operations)
        // if (parseFloat(initialBalance) < parseFloat(minRequired)) {
        //     console.log("Requesting test tokens...");
        //     await sdk.rpcService.requestTestTokens(address);
        //     await new Promise(resolve => setTimeout(resolve, 5000));
        //     const newBalance = await sdk.rpcService.getBalance(address);
        //     console.log("Balance after faucet:", newBalance);
        //
        //     if (parseFloat(newBalance) < parseFloat(minRequired)) {
        //         throw new Error("Insufficient balance for marketplace operations");
        //     }
        // }

        // Create dataset for marketplace
        console.log("Creating dataset for marketplace...");
        const datasetMetadata = {
            format: "CSV",
            size: "1GB",
            description: "Marketplace test dataset",
            version: "1.0",
            lastUpdated: new Date().toISOString()
        };

        const createDatasetTxResult = await sdk.rpcService.createDataset(
            address, // owner address
            "Marketplace Dataset",
            "A dataset for marketplace testing with detailed metadata",
            "AI,Testing,Marketplace",
            "MIT",
            "MIT",
            "https://opensource.org/licenses/MIT",
            JSON.stringify(datasetMetadata),
            false
        );

        if (!createDatasetTxResult.success) {
            throw new Error(`Failed to create dataset for marketplace: ${JSON.stringify(createDatasetTxResult)}`);
        }

        const datasetAddress = createDatasetTxResult.result[0].dataset_address;
        console.log("Dataset created for marketplace:", datasetAddress);

        // Get dataset info to verify creation
        const datasetInfo = await sdk.rpcService.getDatasetInfo(datasetAddress);
        console.log("Dataset info:", datasetInfo);

        // Publish dataset to marketplace
        console.log("Publishing dataset to marketplace...");
        const publishTxResult = await sdk.rpcService.publishDatasetToMarketplace(
            datasetAddress,
            address, // payment asset address
            BigInt("1000000000") // price per block
        );

        if (!publishTxResult.success) {
            throw new Error(`Failed to publish dataset to marketplace: ${JSON.stringify(publishTxResult)}`);
        }

        const marketplaceAssetId = publishTxResult.result[0].marketplace_asset_address;
        console.log("Dataset published to marketplace:", {
            marketplaceAssetId,
            transactionDetails: logTxResult(publishTxResult)
        });

        // Subscribe to dataset
        console.log("Subscribing to dataset...");
        const subscribeTxResult = await sdk.rpcService.subscribeDatasetMarketplace(
            marketplaceAssetId,
            address, // payment asset address
            BigInt(1000) // number of blocks
        );

        if (!subscribeTxResult.success) {
            throw new Error(`Failed to subscribe to dataset: ${JSON.stringify(subscribeTxResult)}`);
        }

        const subscriptionNftAddress = subscribeTxResult.result[0].subscription_nft_address;
        console.log("Subscription complete:", {
            subscriptionNftAddress,
            subscriptionDetails: subscribeTxResult.result[0],
            transactionDetails: logTxResult(subscribeTxResult)
        });

        // Get subscription NFT info
        const subscriptionInfo = await sdk.rpcService.getAssetInfo(subscriptionNftAddress);
        console.log("Subscription NFT info:", subscriptionInfo);

        // Wait a few blocks before claiming payment
        console.log("Waiting for blocks to accumulate...");
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Claim marketplace payment
        console.log("Claiming marketplace payment...");
        const claimTxResult = await sdk.rpcService.claimMarketplacePayment(
            marketplaceAssetId,
            address // payment asset address
        );

        if (!claimTxResult.success) {
            throw new Error(`Failed to claim marketplace payment: ${JSON.stringify(claimTxResult)}`);
        }

        console.log("Payment claimed:", {
            claimDetails: claimTxResult.result[0],
            transactionDetails: logTxResult(claimTxResult)
        });

        // Get final balances and info
        const finalBalance = await sdk.rpcService.getBalance(address);
        console.log("Final NAI balance:", finalBalance);
        const finalDatasetInfo = await sdk.rpcService.getDatasetInfo(datasetAddress);
        console.log("Final dataset info:", finalDatasetInfo);

    } catch (error) {
        console.error("Error in marketplace operations:", error);
        if (error instanceof Error) {
            console.error("- Message:", error.message);
            console.error("- Stack:", error.stack);
        } else {
            console.error("Unknown error:", error);
        }
        throw error;
    }
}

function logTxResult(result: TxResult) {
    return {
        success: result.success,
        timestamp: new Date(result.timestamp).toISOString(),
        fee: result.fee,
        units: {
            bandwidth: result.units.bandwidth,
            compute: result.units.compute,
            storage_read: result.units.storageRead,
            storage_allocate: result.units.storageAllocate,
            storage_write: result.units.storageWrite
        }
    };
}

export { marketplaceEx };