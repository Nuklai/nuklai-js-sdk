// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { auth } from "@nuklai/hyperchain-sdk";
import { NuklaiSDK } from "./dist/index.js";

const sdk = new NuklaiSDK({
  baseApiUrl: "http://api-devnet.nuklaivm-dev.net:9650",
  blockchainId: "zepWp9PbeU9HLHebQ8gXkvxBYH5Bz4v8SoWXE6kyjjwNaMJfC"
});

async function testSDK() {
  console.log("Starting SDK tests...");

  // Testing Health Status
  try {
    console.log("Fetching Health Status...");
    const healthStatus = await sdk.rpcService.ping();
    console.log("Node Ping:", JSON.stringify(healthStatus, null, 2));
  } catch (error) {
    console.error("Failed to fetch Health Status:", error);
  }
}

testSDK();
