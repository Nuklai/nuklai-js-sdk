import { NuklaiSDK } from "../src/sdk.js";
import { PrivateKeySigner } from "hypersdk-client/dist/PrivateKeySigner.js";

async function nonFungibleTokenEx() {
  const sdk = new NuklaiSDK();

  const signer = new PrivateKeySigner(new Uint8Array(32));
  sdk.rpcService.setSigner(signer);

  try {
    // Create NFT collection
    console.log("Creating NFT collection...");
    const createTxResult = await sdk.rpcService.createNFTAsset(
      "Test NFT Collection",
      "TNFT",
      "Test NFT collection metadata",
      BigInt(1000),
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx",
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx",
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx",
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx"
    );

    if (!createTxResult.success) {
      throw new Error("Failed to create NFT collection");
    }

    const collectionAddress = createTxResult.result[0].assetAddress;
    console.log("NFT collection created with address:", collectionAddress);

    // Mint NFT
    console.log("Minting NFT...");
    const mintTxResult = await sdk.rpcService.mintNFTAsset(
      collectionAddress,
      JSON.stringify({
        name: "Test NFT #1",
        description: "First test NFT",
        image: "ipfs://...",
      }),
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx"
    );

    if (!mintTxResult.success) {
      throw new Error("Failed to mint NFT");
    }
    console.log("NFT minted:", mintTxResult);
  } catch (error) {
    console.error("Error in NFT operations:", error);
  }
}

export { nonFungibleTokenEx };
