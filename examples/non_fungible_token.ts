import { NuklaiSDK, MAINNET_PUBLIC_API_BASE_URL } from "../src/sdk.js";
import { PrivateKeySigner } from "hypersdk-client/dist/PrivateKeySigner.js";

async function nonFungibleTokenEx() {
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

        // Create NFT collection using CreateAsset with asset_type = 2
        console.log("Creating NFT collection...");
        const createTxResult = await sdk.rpcService.createNFTAsset(
            "Test NFT Collection",
            "TNFT",
            "Test NFT collection metadata",
            BigInt(1000), // max supply
            address,
            address,
            address,
            address
        );

        if (!createTxResult.success) {
            throw new Error(`Failed to create NFT collection: ${JSON.stringify(createTxResult)}`);
        }

        const collectionAddress = createTxResult.result[0].asset_id;
        console.log("NFT collection created with address:", collectionAddress);

        // Get collection info to verify creation
        const collectionInfo = await sdk.rpcService.getAssetInfo(collectionAddress);
        console.log("Collection info:", collectionInfo);

        // Mint NFT
        console.log("Minting NFT...");
        const nftMetadata = {
            name: "Test NFT #1",
            description: "First test NFT",
            image: "ipfs://...",
            attributes: [
                { trait_type: "Test", value: "Value" }
            ]
        };

        const mintTxResult = await sdk.rpcService.mintNFTAsset(
            collectionAddress,
            JSON.stringify(nftMetadata),
            address // mint to our address
        );

        if (!mintTxResult.success) {
            throw new Error(`Failed to mint NFT: ${JSON.stringify(mintTxResult)}`);
        }

        const nftAddress = mintTxResult.result[0].asset_nft_address;
        console.log("NFT minted with address:", nftAddress);

        // Get NFT info to verify minting
        const nftInfo = await sdk.rpcService.getAssetInfo(nftAddress);
        console.log("NFT info:", nftInfo);

        // Get final balances and collection state
        const finalBalance = await sdk.rpcService.getBalance(address);
        console.log("Final NAI balance:", finalBalance);
        const finalCollectionInfo = await sdk.rpcService.getAssetInfo(collectionAddress);
        console.log("Final collection info:", finalCollectionInfo);

    } catch (error) {
        console.error("Error in NFT operations:", error);
        if (error instanceof Error) {
            console.error("- Message:", error.message);
            console.error("- Stack:", error.stack);
        } else {
            console.error("Unknown error:", error);
        }
        throw error;
    }
}

export { nonFungibleTokenEx };