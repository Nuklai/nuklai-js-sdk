import { NuklaiSDK, MAINNET_PUBLIC_API_BASE_URL } from "../src/sdk.js";
import { PrivateKeySigner } from "hypersdk-client/dist/PrivateKeySigner.js";

async function fungibleTokenEx() {
    // Initialize SDK with proper endpoint
    const sdk = new NuklaiSDK(MAINNET_PUBLIC_API_BASE_URL);

    // Set up signer with a private key
    const privateKey = new Uint8Array(32);
    const signer = new PrivateKeySigner(privateKey);
    const address = Buffer.from(signer.getPublicKey()).toString('hex');
    console.log("Using address:", address);

    await sdk.rpcService.setSigner(signer);

    try {
        // Test basic connectivity and get ABI
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

        // Create a new fungible token using CreateAsset action
        console.log("Creating fungible token...");
        const createTxResult = await sdk.rpcService.createFTAsset(
            "Test Token",
            "TEST",
            18,
            "Test token metadata",
            BigInt("1000000000000000000000000"), // Max supply
            address,
            address,
            address,
            address
        );

        if (!createTxResult.success) {
            throw new Error(`Failed to create token: ${JSON.stringify(createTxResult)}`);
        }

        const assetAddress = createTxResult.result[0].asset_id;
        console.log("Token created with address:", assetAddress);

        // Get asset info to verify creation
        const assetInfo = await sdk.rpcService.getAssetInfo(assetAddress);
        console.log("Asset info:", assetInfo);

        // Mint tokens
        console.log("Minting tokens...");
        const mintAmount = BigInt("1000000000000000000"); // 1 token
        const mintTxResult = await sdk.rpcService.mintFTAsset(
            address, // to
            assetAddress,
            mintAmount
        );

        if (!mintTxResult.success) {
            throw new Error(`Failed to mint tokens: ${JSON.stringify(mintTxResult)}`);
        }
        console.log("Tokens minted successfully");

        // Transfer tokens
        console.log("Transferring tokens...");
        const transferAmount = BigInt("100000000000000000"); // 0.1 token
        const transferTxResult = await sdk.rpcService.transfer(
            address, // to self for testing
            assetAddress,
            transferAmount,
            "Test transfer"
        );

        if (!transferTxResult.success) {
            throw new Error(`Failed to transfer tokens: ${JSON.stringify(transferTxResult)}`);
        }
        console.log("Transfer completed successfully");

        // Get final balances
        const finalBalance = await sdk.rpcService.getBalance(address);
        console.log("Final NAI balance:", finalBalance);
        const finalAssetInfo = await sdk.rpcService.getAssetInfo(assetAddress);
        console.log("Final asset info:", finalAssetInfo);

    } catch (error) {
        console.error("Error in fungible token operations:", error);
        if (error instanceof Error) {
            console.error("- Message:", error.message);
            console.error("- Stack:", error.stack);
        } else {
            console.error("Unknown error:", error);
        }
        throw error;
    }
}

export { fungibleTokenEx };