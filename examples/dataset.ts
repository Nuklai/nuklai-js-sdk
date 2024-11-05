import { NuklaiSDK, MAINNET_PUBLIC_API_BASE_URL } from "../src/sdk.js";
import { PrivateKeySigner } from "hypersdk-client/dist/PrivateKeySigner.js";
import { TxResult } from "hypersdk-client/dist/apiTransformers.js";

async function datasetEx() {
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
        // const minRequired = "1000000000"; // 1 NAI
        // if (parseFloat(initialBalance) < parseFloat(minRequired)) {
        //     console.log("Requesting test tokens...");
        //     await sdk.rpcService.requestTestTokens(address);
        //     await new Promise(resolve => setTimeout(resolve, 5000));
        //     const newBalance = await sdk.rpcService.getBalance(address);
        //     console.log("Balance after faucet:", newBalance);
        //
        //     if (parseFloat(newBalance) < parseFloat(minRequired)) {
        //         throw new Error("Insufficient balance for transactions");
        //     }
        // }

        // Create dataset
        console.log("Creating dataset...");
        const datasetMetadata = {
            format: "CSV",
            size: "1GB",
            schema: {
                fields: [
                    { name: "field1", type: "string" },
                    { name: "field2", type: "number" }
                ]
            }
        };

        const createTxResult = await sdk.rpcService.createDataset(
            address, // asset address (owner)
            "Test Dataset",
            "A test dataset with comprehensive metadata",
            "AI,Testing,Example",
            "MIT",
            "MIT",
            "https://opensource.org/licenses/MIT",
            JSON.stringify(datasetMetadata),
            false // not a community dataset
        );

        if (!createTxResult.success) {
            throw new Error(`Failed to create dataset: ${JSON.stringify(createTxResult)}`);
        }

        const datasetAddress = createTxResult.result[0].dataset_address; // Note snake_case
        console.log("Dataset created:", {
            address: datasetAddress,
            transactionDetails: logTxResult(createTxResult)
        });

        // Get dataset info to verify creation
        const datasetInfo = await sdk.rpcService.getDatasetInfo(datasetAddress);
        console.log("Dataset info:", datasetInfo);

        // Initiate contribution
        console.log("Initiating dataset contribution...");
        const dataLocation = "ipfs://QmExample...";
        const dataIdentifier = `test-data-${Date.now()}`;

        const initiateTxResult = await sdk.rpcService.initiateContributeDataset(
            datasetAddress,
            dataLocation,
            dataIdentifier
        );

        if (!initiateTxResult.success) {
            throw new Error(`Failed to initiate dataset contribution: ${JSON.stringify(initiateTxResult)}`);
        }

        const contributionId = initiateTxResult.result[0].dataset_contribution_id; // Note snake_case
        console.log("Contribution initiated:", {
            contributionId,
            transactionDetails: logTxResult(initiateTxResult)
        });

        // Complete contribution
        console.log("Completing dataset contribution...");
        const completeTxResult = await sdk.rpcService.completeContributeDataset(
            contributionId,
            datasetAddress,
            address // contributor address
        );

        if (!completeTxResult.success) {
            throw new Error(`Failed to complete dataset contribution: ${JSON.stringify(completeTxResult)}`);
        }

        console.log("Contribution completed:", {
            details: completeTxResult.result[0],
            transactionDetails: logTxResult(completeTxResult)
        });

        // Get final dataset info
        const finalDatasetInfo = await sdk.rpcService.getDatasetInfo(datasetAddress);
        console.log("Final dataset info:", finalDatasetInfo);

        // Get final balance
        const finalBalance = await sdk.rpcService.getBalance(address);
        console.log("Final NAI balance:", finalBalance);

    } catch (error) {
        console.error("Error in dataset operations:", error);
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
            storage_read: result.units.storageRead, // Note snake_case
            storage_allocate: result.units.storageAllocate,
            storage_write: result.units.storageWrite
        }
    };
}

export { datasetEx };