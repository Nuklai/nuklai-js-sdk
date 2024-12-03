import { beforeAll, describe, expect, it } from "@jest/globals";
import { NuklaiSDK } from "../src";
import { MAINNET_PUBLIC_API_BASE_URL } from "../src/endpoints";

const API_HOST = MAINNET_PUBLIC_API_BASE_URL;

describe("NuklaiSDK Wallet Management", () => {
  let sdk: NuklaiSDK;
  let testWallet: {
    address: string;
    privateKey: string;
    publicKey: string;
  };

  beforeAll(() => {
    console.log("Initializing SDK with API host:", API_HOST);
    sdk = new NuklaiSDK(API_HOST);
  });

  describe("ED25519 Wallet Operations", () => {
    it("should generate a new ED25519 wallet", () => {
      console.log("Generating ED25519 wallet...");
      const wallet = sdk.generateED25519Wallet();

      console.log("Generated ED25519 Wallet:", {
        address: wallet.address,
        publicKeyLength: wallet.publicKey.length,
        privateKeyLength: wallet.privateKey.length,
      });

      expect(wallet.address).toBeDefined();
      expect(wallet.address).toMatch(/^00/);
      expect(wallet.privateKey).toBeDefined();
      expect(wallet.privateKey.length).toBe(64);
      expect(wallet.publicKey).toBeDefined();
      expect(wallet.publicKey.length).toBe(64);

      // Save wallet for other tests
      testWallet = wallet;
    });

    it("should import existing ED25519 wallet", () => {
      expect(testWallet?.privateKey).toBeDefined();

      console.log(
        "Importing ED25519 wallet with private key:",
        testWallet.privateKey
      );
      const imported = sdk.importWallet(testWallet.privateKey, "ed25519");

      console.log("Imported ED25519 Wallet:", {
        address: imported.address,
        publicKeyLength: imported.publicKey.length,
      });

      expect(imported.address).toBe(testWallet.address);
    });

    it("should validate ED25519 address", () => {
      expect(testWallet?.address).toBeDefined();
      const isValid = sdk.validateAddress(testWallet.address);
      expect(isValid).toBe(true);
    });
  });

  describe("BLS Wallet Operations", () => {
    let blsWallet: { address: string; privateKey: string; publicKey: string };

    it("should generate a new BLS wallet", () => {
      blsWallet = sdk.generateBLSWallet();
      expect(blsWallet.address).toMatch(/^00/);
      expect(blsWallet.privateKey).toBeDefined();
      expect(blsWallet.publicKey).toBeDefined();
    });

    it("should validate BLS address", () => {
      expect(blsWallet?.address).toBeDefined();
      const isValid = sdk.validateAddress(blsWallet.address);
      expect(isValid).toBe(true);
    });
  });

  describe("Invalid Operations", () => {
    it("should reject invalid addresses", () => {
      const invalidAddresses = [
        "invalid",
        "nuklai1invalid",
        "0x1234567890",
        "",
        "   ",
        "01" + "a".repeat(64),
      ];

      for (const addr of invalidAddresses) {
        const isValid = sdk.validateAddress(addr);
        expect(isValid).toBe(false);
      }
    });

    it("should handle invalid private key import", () => {
      const invalidKeys = ["invalid", "0x1234", "", "   ", "1".repeat(63)];

      for (const key of invalidKeys) {
        expect(() => sdk.importWallet(key, "ed25519")).toThrow();
      }
    });
  });

  describe("Signer Operations", () => {
    it("should set ED25519 signer", () => {
      expect(testWallet?.privateKey).toBeDefined();
      expect(() => {
        sdk.setSigner(testWallet.privateKey, "ed25519");
      }).not.toThrow();
    });

    it("should handle invalid signer key", () => {
      expect(() => {
        sdk.setSigner("invalid_key", "ed25519");
      }).toThrow();
    });
  });

  describe("Format Operations", () => {
    describe("Transaction Hash Format", () => {
      it("should correctly format transaction hashes", () => {
        const testCases = [
          {
            input:
              "89cc59b55743bf859946e18bfa61055b77a5fd5e6b297de8f5757b45f85ae207",
            expected: "HTfL1JGbGpds7dndpPwbi9WamLXEzvcs3SF5QmjrnTuS8gcLG",
          },
          // Keep existing base58 format
          {
            input: "HTfL1JGbGpds7dndpPwbi9WamLXEzvcs3SF5QmjrnTuS8gcLG",
            expected: "HTfL1JGbGpds7dndpPwbi9WamLXEzvcs3SF5QmjrnTuS8gcLG",
          },
          // Handle with 0x prefix
          {
            input:
              "0x89cc59b55743bf859946e18bfa61055b77a5fd5e6b297de8f5757b45f85ae207",
            expected: "HTfL1JGbGpds7dndpPwbi9WamLXEzvcs3SF5QmjrnTuS8gcLG",
          },
        ];

        for (const { input, expected } of testCases) {
          const formatted = sdk.formatTxHash(input);
          expect(formatted).toBe(expected);
        }
      });

      it("should handle invalid transaction hashes", () => {
        const invalidHashes = [
          "",
          "invalid",
          "0x123", // too short
        ];

        for (const hash of invalidHashes) {
          expect(() => sdk.formatTxHash(hash)).not.toThrow();
        }
      });
    });

    describe("Sponsor Address Format", () => {
      it("should correctly format sponsor addresses", () => {
        const testCases = [
          {
            input:
              "b911f4d022fe6864c6dc9a37eab1e15cb3995e3734eb2ad832585c95d7066edc",
            expected:
              "00b911f4d022fe6864c6dc9a37eab1e15cb3995e3734eb2ad832585c95d7066edc",
          },
          // Already has 00 prefix
          {
            input:
              "00b911f4d022fe6864c6dc9a37eab1e15cb3995e3734eb2ad832585c95d7066edc",
            expected:
              "00b911f4d022fe6864c6dc9a37eab1e15cb3995e3734eb2ad832585c95d7066edc",
          },
          // With 0x prefix
          {
            input:
              "0xb911f4d022fe6864c6dc9a37eab1e15cb3995e3734eb2ad832585c95d7066edc",
            expected:
              "00b911f4d022fe6864c6dc9a37eab1e15cb3995e3734eb2ad832585c95d7066edc",
          },
          // Mixed case
          {
            input:
              "0xB911F4D022fe6864c6dc9a37eab1e15cb3995e3734eb2ad832585c95d7066edc",
            expected:
              "00b911f4d022fe6864c6dc9a37eab1e15cb3995e3734eb2ad832585c95d7066edc",
          },
        ];

        for (const { input, expected } of testCases) {
          const formatted = sdk.formatAddress(input);
          expect(formatted).toBe(expected);
        }
      });

      it("should handle invalid sponsor addresses", () => {
        const invalidAddresses = [
          "invalid",
          "nuklai1invalid",
          "0x1234567890",
          "",
          "   ",
          "01" + "a".repeat(63), // 65 chars instead of 64
        ];

        for (const address of invalidAddresses) {
          expect(() => sdk.formatAddress(address)).toThrow("Invalid address");
        }
      });
    });
  });
});
