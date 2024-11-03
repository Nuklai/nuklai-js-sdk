import { NuklaiSDK } from "../src/sdk.js";
import fetch from "node-fetch";

const API_ENDPOINT = "http://34.243.127.171:9650";
const API_PATH = "/ext/bc/nuklaivm/rpc";

async function testConnection() {
  console.log("Testing connection to:", API_ENDPOINT);

  // 1. Basic HTTP test
  try {
    console.log("\n1. Testing basic HTTP connection...");
    const response = await fetch(API_ENDPOINT);
    console.log("Basic connection response:", {
      status: response.status,
      contentType: response.headers.get("content-type"),
    });
  } catch (error) {
    console.error("Basic HTTP test failed:", error);
  }

  // 2. Test RPC endpoint
  try {
    console.log("\n2. Testing RPC endpoint...");
    const rpcResponse = await fetch(`${API_ENDPOINT}${API_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "nuklaivm.ping",
        params: {},
      }),
    });

    const text = await rpcResponse.text();
    console.log("RPC response:", {
      status: rpcResponse.status,
      contentType: rpcResponse.headers.get("content-type"),
      body: text.substring(0, 200), // First 200 chars
    });
  } catch (error) {
    console.error("RPC test failed:", error);
  }

  // 3. Test SDK initialization
  try {
    console.log("\n3. Testing SDK initialization...");
    const sdk = new NuklaiSDK({
      baseApiUrl: API_ENDPOINT,
      blockchainId: "DPqCib879gKLxtL7Wao6WTh5hNUYFFBZSL9otsLAZ6wKPJuXb",
    });
    console.log("SDK initialized successfully");

    // Try to get ABI
    console.log("\n4. Testing ABI retrieval...");
    const abi = await sdk.rpcService.getAbi();
    console.log("ABI retrieved:", {
      actionsCount: abi?.actions?.length ?? 0,
      typesCount: abi?.types?.length ?? 0,
    });
  } catch (error) {
    console.error("SDK test failed:", error);
  }
}

// Run the test
console.log("Starting connection tests...");
testConnection()
  .then(() => console.log("\nTests completed"))
  .catch((error) => console.error("\nTest suite failed:", error));
