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
            // Use actual test data from the error message
            input:
              "89cc59b55743bf859946e18bfa61055b77a5fd5e6b297de8f5757b45f85ae207",
            expected: "23gsXhRi6Lojtfx4zet3Tf6fybJpgoxouxVscyCD1UGUEpJs2g",
          },
        ];

        for (const { input, expected } of testCases) {
          const result = sdk.formatTxHash(input);
          expect(result).toBe(expected);
        }
      });

      it("should handle invalid transaction hashes", () => {
        const invalidHashes = ["", "invalid", "0x123"];
        for (const hash of invalidHashes) {
          expect(() => sdk.formatTxHash(hash)).toThrow(
            "Invalid transaction hash format"
          );
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
          {
            input:
              "nuklai1qtndw2k9m7mg8y227e5r3hmp949s6quch6g8507kdxc95ln5kx0xc7zpgqa",
            expected:
              "0002e6d72ac5dfb683914af66838df612d4b0d0398be907a3fd669b05a7e74b19e6c",
          },
        ];

        for (const { input, expected } of testCases) {
          const result = sdk.formatAddress(input);
          expect(result).toBe(expected);
        }
      });

      it("should handle invalid sponsor addresses", () => {
        const invalidAddresses = [
          "",
          "   ",
          "0x1234567890",
          "01" + "a".repeat(64),
        ];

        for (const address of invalidAddresses) {
          expect(() => sdk.formatAddress(address)).toThrow(
            /Invalid address|Unknown letter/
          );
        }
      });
    });
  });
});
