import { describe, expect, it, beforeAll } from "@jest/globals";
import { HyperSDKClient } from "hypersdk-client";
import { HyperSDKHTTPClient } from "hypersdk-client/dist/HyperSDKHTTPClient";
import { VMABI } from "hypersdk-client/dist/Marshaler";
import { VM_NAME, VM_RPC_PREFIX } from "../src/endpoints";

const API_HOST = "http://localhost:9650";
const DEMO_ADDRESS =
  "00c4cb545f748a28770042f893784ce85b107389004d6a0e0d6d7518eeae1292d9";

describe("NuklaiSDK Basic Functionality", () => {
  let vmClient: HyperSDKClient;
  let httpClient: HyperSDKHTTPClient;
  let abi: VMABI;

  beforeAll(async () => {
    vmClient = new HyperSDKClient(API_HOST, VM_NAME, VM_RPC_PREFIX);
    httpClient = new HyperSDKHTTPClient(API_HOST, VM_NAME, VM_RPC_PREFIX);

    console.log("SDK init using::", {
      apiHost: API_HOST,
      vmName: VM_NAME,
      rpcPrefix: VM_RPC_PREFIX,
    });

    abi = await vmClient.getAbi();
  });

  it("should connect to the endpoint and retrieve ABI", async () => {
    try {
      console.log("Retrieving ABI...");
      expect(abi).toBeDefined();
      expect(abi.actions).toBeDefined();
      expect(Array.isArray(abi.actions)).toBe(true);
      expect(abi.types).toBeDefined();
      expect(Array.isArray(abi.types)).toBe(true);
      console.log("ABI actions:", abi.actions.length);
      console.log("ABI types:", abi.types.length);
    } catch (error) {
      console.error("testing ABI failed:", error);
      throw error;
    }
  }, 30000);

  it("should handle basic balance query", async () => {
    try {
      console.log("Get balance for:", DEMO_ADDRESS);
      const result = await httpClient.makeVmAPIRequest<{ amount: string }>(
        "balance",
        {
          address: DEMO_ADDRESS,
          asset: "NAI",
        }
      );

      expect(result).toBeDefined();
      expect(result.amount).toBeDefined();
      const balance = BigInt(result.amount);
      console.log("Gotten Balance:", balance.toString());
      expect(typeof balance).toBe("bigint");
    } catch (error) {
      console.error("Balance query failed:", error);
      throw error;
    }
  }, 30000);

  it("should validate connection", async () => {
    try {
      const abi = await vmClient.getAbi();
      const isConnected = !!abi;
      expect(isConnected).toBe(true);
      console.log("Connection validated successfully");
    } catch (error) {
      console.error("Connection validation failed:", error);
      throw error;
    }
  }, 30000);
});
