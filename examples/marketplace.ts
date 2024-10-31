// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { NuklaiSDK } from "../src";
import { PrivateKeySigner } from "hypersdk-client/dist/PrivateKeySigner";
import { TxResult } from "hypersdk-client/dist/apiTransformers";

async function marketplaceExamples() {
  const sdk = new NuklaiSDK({
    baseApiUrl: "http://api-devnet.nuklaivm-dev.net:9650",
    blockchainId: "24h7hzFfHG2vCXtT1MKsxP1VkYb9kkKHAvhJim1Xb7Y6W15zY5",
  });

  const signer = new PrivateKeySigner(new Uint8Array(32));
  sdk.rpcService.setSigner(signer);

  try {
    // First create a dataset to publish
    console.log("Creating dataset for marketplace...");
    const createDatasetTxResult = await sdk.rpcService.createDataset(
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx",
      "Marketplace Dataset",
      "A dataset for marketplace testing",
      "AI,Testing",
      "MIT",
      "MIT",
      "https://opensource.org/licenses/MIT",
      JSON.stringify({ format: "CSV", size: "1GB" }),
      false
    );

    if (!createDatasetTxResult.success) {
      throw new Error("Failed to create dataset for marketplace");
    }

    const datasetAddress = createDatasetTxResult.result[0].datasetAddress;
    console.log("Dataset created for marketplace:", datasetAddress);

    // Publish dataset to marketplace
    console.log("Publishing dataset to marketplace...");
    const publishTxResult = await sdk.rpcService.publishDatasetToMarketplace(
      datasetAddress,
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx", // payment asset
      BigInt("1000000000") // price per block
    );

    if (!publishTxResult.success) {
      throw new Error("Failed to publish dataset to marketplace");
    }

    const marketplaceAssetId = publishTxResult.result[0].marketplaceAssetID;
    console.log("Dataset published to marketplace:", {
      marketplaceAssetId,
      transactionDetails: logTxResult(publishTxResult),
    });

    // Subscribe to dataset
    console.log("Subscribing to dataset...");
    const subscribeTxResult = await sdk.rpcService.subscribeDatasetMarketplace(
      marketplaceAssetId,
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx", // payment asset
      BigInt(1000) // number of blocks
    );

    if (!subscribeTxResult.success) {
      throw new Error("Failed to subscribe to dataset");
    }

    console.log("Subscription complete:", {
      subscriptionDetails: subscribeTxResult.result[0],
      transactionDetails: logTxResult(subscribeTxResult),
    });

    // Claim marketplace payment
    console.log("Claiming marketplace payment...");
    const claimTxResult = await sdk.rpcService.claimMarketplacePayment(
      marketplaceAssetId,
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx" // payment asset
    );

    if (!claimTxResult.success) {
      throw new Error("Failed to claim marketplace payment");
    }

    console.log("Payment claimed:", {
      claimDetails: claimTxResult.result[0],
      transactionDetails: logTxResult(claimTxResult),
    });
  } catch (error) {
    console.error("Error in marketplace operations:", error);
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
      storageRead: result.units.storageRead,
      storageAllocate: result.units.storageAllocate,
      storageWrite: result.units.storageWrite,
    },
  };
}

export { marketplaceExamples };
