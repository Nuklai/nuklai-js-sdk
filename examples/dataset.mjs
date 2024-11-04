import { NuklaiSDK } from "../src/sdk.js";
import { PrivateKeySigner } from "hypersdk-client/dist/PrivateKeySigner.js";
import { TxResult } from "hypersdk-client/dist/apiTransformers.js";

async function datasetEx() {
  const sdk = new NuklaiSDK();

  const signer = new PrivateKeySigner(new Uint8Array(32));
  sdk.rpcService.setSigner(signer);

  try {
    // Create dataset
    console.log("Creating dataset...");
    const createTxResult = await sdk.rpcService.createDataset(
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx",
      "Test Dataset",
      "A test dataset",
      "AI,Testing",
      "MIT",
      "MIT",
      "https://opensource.org/licenses/MIT",
      JSON.stringify({ format: "CSV", size: "1GB" }),
      false
    );

    if (!createTxResult.success) {
      throw new Error("Failed to create dataset");
    }

    const datasetAddress = createTxResult.result[0].datasetAddress;
    console.log("Dataset created:", {
      address: datasetAddress,
      transactionDetails: logTxResult(createTxResult),
    });

    // Initiate contribution
    console.log("Initiating dataset contribution...");
    const initiateTxResult = await sdk.rpcService.initiateContributeDataset(
      datasetAddress,
      "ipfs://QmExample...",
      "test-data-001"
    );

    if (!initiateTxResult.success) {
      throw new Error("Failed to initiate dataset contribution");
    }

    const contributionId = initiateTxResult.result[0].datasetContributionID;
    console.log("Contribution initiated:", {
      contributionId,
      transactionDetails: logTxResult(initiateTxResult),
    });

    // Complete contribution
    console.log("Completing dataset contribution...");
    const completeTxResult = await sdk.rpcService.completeContributeDataset(
      contributionId,
      datasetAddress,
      "nuklai1qrzvk4zlwj9zsacqgtufx7zvapd3quufqpxk5rsdd4633m4wz2fdjss0gwx" // contributor address
    );

    if (!completeTxResult.success) {
      throw new Error("Failed to complete dataset contribution");
    }

    console.log("Contribution completed:", {
      details: completeTxResult.result[0],
      transactionDetails: logTxResult(completeTxResult),
    });
  } catch (error) {
    console.error("Error in dataset operations:", error);
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

export { datasetEx };
