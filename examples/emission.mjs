import { NuklaiSDK } from "../dist/index.js";

const sdk = new NuklaiSDK({
  baseApiUrl: "http://127.0.0.1:9650",
  blockchainId: "zepWp9PbeU9HLHebQ8gXkvxBYH5Bz4v8SoWXE6kyjjwNaMJfC"
});

async function testSDK() {
  console.log("Starting SDK tests...");

  // Testing Health Status
  try {
    console.log("Fetching Health Status...");
    const healthStatus = await sdk.hyperApiService.ping();
    console.log("Node Ping:", JSON.stringify(healthStatus, null, 2));
  } catch (error) {
    console.error("Failed to fetch Health Status:", error);
  }

  // Testing Emission Information
  try {
    console.log("Fetching Emission Info...");
    const emissionInfo = await sdk.emissionService.getEmissionInfo();
    console.log("Emission Info:", JSON.stringify(emissionInfo, null, 2));
  } catch (error) {
    console.error("Failed to fetch Emission Info:", error);
  }
}

testSDK();