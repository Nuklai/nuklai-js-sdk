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

  // Testing BLS Key Generation
  try {
    console.log("Generating BLS Key Pair...");
    const { privateKey, publicKey } = await sdk.blsAuth.generateKeyPair();
    console.log(
      "Generated BLS Private Key:",
      sdk.blsAuth.secretKeyToHex(privateKey)
    );
    console.log(
      "Generated BLS Public Key:",
      sdk.blsAuth.publicKeyToHex(publicKey)
    );

    const message = new TextEncoder().encode("Test message");
    const signature = sdk.blsAuth.sign(message, privateKey);
    console.log("Signature:", Buffer.from(signature).toString("hex"));

    const isValid = sdk.blsAuth.verify(message, publicKey, signature);
    console.log("Signature valid:", isValid);

    const address = sdk.blsAuth.generateAddress(publicKey);
    console.log("Generated Address:", address);
  } catch (error) {
    console.error("Failed to generate BLS Key Pair:", error);
  }

  // Initialize BLS
  try {
    console.log("Initializing BLS...");
    const privateKeyHex =
      "5262814baaa103b3b6fe0f0e0aacdd3a0dffd271dcd5255f737815c1207a59d2";
    const bls = new sdk.blsAuth(sdk.blsAuth.hexToSecretKey(privateKeyHex));
    console.log("Public Key:", sdk.blsAuth.publicKeyToHex(bls.publicKey));
    console.log("Address:", bls.address);
  } catch (error) {
    console.error("Failed to initialize BLS:", error);
  }
}

testSDK();
