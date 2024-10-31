// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { NuklaiSDK } from "../src/sdk";
import { PrivateKeySigner } from "hypersdk-client/dist/PrivateKeySigner";

async function fungibleTokenExamples() {
  // Initialize SDK
  const sdk = new NuklaiSDK({
    baseApiUrl: "http://api-devnet.nuklaivm-dev.net:9650",
    blockchainId: "24h7hzFfHG2vCXtT1MKsxP1VkYb9kkKHAvhJim1Xb7Y6W15zY5",
  });

  // Set up signer with a private key
  const privateKey = new Uint8Array(32);
  const signer = new PrivateKeySigner(privateKey);
  sdk.rpcService.setSigner(signer);

  try {
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
  }
}

export { fungibleTokenExamples };
