// test.mjs
import { NuklaiSDK } from "./dist/index.js";

const sdk = new NuklaiSDK({
  baseApiUrl: "http://127.0.0.1:9656",
  blockchainId: "twFiKqa68ydBJABsdo4nZGPLaaFrmK3YhJcYLkyTPRfp2YxPQ"
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

  // Testing Network Information
  /* try {
    console.log("Fetching Network Info...");
    const networkInfo = await sdk.hyperApiService.getNetworkInfo();
    console.log("Network Info:", JSON.stringify(networkInfo, null, 2));
  } catch (error) {
    console.error("Failed to fetch Network Info:", error);
  }
 */

  // Testing Genesis Information
  /* try {
    console.log("Fetching Genesis...");
    const genesisInfo = await sdk.genesisService.getGenesisInfo();
    console.log("Genesis Info:", JSON.stringify(genesisInfo, null, 2));
  } catch (error) {
    console.error("Failed to fetch Genesis:", error);
  } */

  // Testing Balance
  /*   try {
    console.log("Fetching Balance...");
    const params = {
      address:
        "nuklai1qpg4ecapjymddcde8sfq06dshzpxltqnl47tvfz0hnkesjz7t0p35d5fnr3",
      asset: "11111111111111111111111111111111LpoYY"
    };
    const balance = await sdk.assetService.getBalance(params);
    console.log("Balance:", JSON.stringify(balance, null, 2));
  } catch (error) {
    console.error("Failed to fetch Balance:", error);
  } */

  // Testing Emission Information
  /*   try {
    console.log("Fetching Emission Info...");
    const emissionInfo = await sdk.emissionService.getEmissionInfo();
    console.log("Emission Info:", JSON.stringify(emissionInfo, null, 2));
  } catch (error) {
    console.error("Failed to fetch Emission Info:", error);
  } */

  // Testing BLS Key Generation
  /*   try {
    console.log("Generating BLS Key Pair...");
    const { privateKey, publicKey } = await sdk.blsService.generateKeyPair();
    console.log(
      "Generated BLS Private Key:",
      sdk.blsService.secretKeyToHex(privateKey)
    );
    console.log(
      "Generated BLS Public Key:",
      sdk.blsService.publicKeyToHex(publicKey)
    );

    const message = new TextEncoder().encode("Test message");
    const signature = sdk.blsService.sign(message, privateKey);
    console.log("Signature:", Buffer.from(signature).toString("hex"));

    const isValid = sdk.blsService.verify(message, publicKey, signature);
    console.log("Signature valid:", isValid);

    const address = sdk.blsService.generateAddress(publicKey);
    console.log("Generated Address:", address);
  } catch (error) {
    console.error("Failed to generate BLS Key Pair:", error);
  } */

  // Testing NAI Transfer
  try {
    console.log("Creating Transfer Transaction...");
    const transaction =
      await sdk.nuklaiTransactionService.createTransferTransaction(
        "nuklai1qfgc2st57mmtzet7ajq4lh6d6rp3ev277ejxpandlzzy35v5fnhf6ccx39e", // sender address
        "nuklai1qpxncu2a69l9wyz3yqg4fqn86ys2ll6ja7vhym5qn2vk4cdyvgj2vn4k7wz", // receiver address
        "11111111111111111111111111111111LpoYY", // asset ID
        "0.0001", // amount
        "Test Memo" // memo
      );
    console.log("Transaction:", transaction);

    console.log("Signing and Sending Transaction...");
    const txId = await sdk.nuklaiTransactionService.signAndSendTransaction(
      "5262814baaa103b3b6fe0f0e0aacdd3a0dffd271dcd5255f737815c1207a59d2", // nuklai1qfgc2st57mmtzet7ajq4lh6d6rp3ev277ejxpandlzzy35v5fnhf6ccx39e
      transaction
    );
    console.log("Transaction ID:", txId);
  } catch (error) {
    console.error("Failed to transfer crypto:", error);
  }
}

testSDK();
