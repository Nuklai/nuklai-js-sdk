import { NuklaiSDK } from "../src/sdk.js";
import { PrivateKeySigner } from "hypersdk-client/dist/PrivateKeySigner.js";

async function fungibleTokenEx() {
  // Initialize SDK
  const sdk = new NuklaiSDK();

  // Set up signer with a private key
  const privateKey = new Uint8Array(32);
  const signer = new PrivateKeySigner(privateKey);
  sdk.rpcService.setSigner(signer);

  try {
    // Test basic connectivity first
    console.log("Testing basic connectivity...");
    const abi = await sdk.rpcService.getAbi().catch((error) => {
      console.error("Failed to get ABI:", error);
      throw new Error("Basic connectivity test failed");
    });

    // Create a new fungible token
    console.log("Creating fungible token...");
    const createTxResult = await sdk.rpcService.createFTAsset(
      "Test Token",
      "TEST",
      18,
      "Test token metadata",
      BigInt("1000000000000000000000000"),
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx",
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx",
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx",
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx"
    );

    if (!createTxResult.success) {
      throw new Error("Failed to create token");
    }

    const assetAddress = createTxResult.result[0].assetAddress;
    console.log("Token created with address:", assetAddress);

    // Mint tokens
    console.log("Minting tokens...");
    const mintTxResult = await sdk.rpcService.mintFTAsset(
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx",
      assetAddress,
      BigInt("1000000000000000000")
    );

    if (!mintTxResult.success) {
      throw new Error("Failed to mint tokens");
    }
    console.log("Tokens minted:", mintTxResult);

    // Transfer tokens
    console.log("Transferring tokens...");
    const transferTxResult = await sdk.rpcService.transfer(
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx",
      assetAddress,
      BigInt("100000000000000000"),
      "Test transfer"
    );

    if (!transferTxResult.success) {
      throw new Error("Failed to transfer tokens");
    }
    console.log("Transfer complete:", transferTxResult);
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
