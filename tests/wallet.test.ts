import { beforeAll, describe, expect, it } from '@jest/globals';
import { MAINNET_PUBLIC_API_BASE_URL, NuklaiSDK } from '../src/sdk';
import { NuklaiWallet } from '../src/wallet';

const API_HOST = MAINNET_PUBLIC_API_BASE_URL;
const TEST_PRIVATE_KEY = '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd0';
const TEST_ADDRESS = 'c4cb545f748a28770042f893784ce85b107389004d6a0e0d6d7518eeae1292d9';
const NAI_ASSET_ADDRESS = 'cf77495ce1bdbf11e5e45463fad5a862cb6cc0a20e00e658c4ac3355dcdc64bb';

describe('NuklaiSDK Wallet Integration', () => {
    let sdk: NuklaiSDK;

    beforeAll(async () => {
        sdk = new NuklaiSDK(API_HOST);
    });

    describe('Wallet Creation and Connection', () => {
        it('should create and connect a new wallet with transaction capability', async () => {
            const wallet = sdk.createWallet();
            expect(wallet).toBeInstanceOf(NuklaiWallet);
            expect(sdk.isWalletConnected()).toBe(true);

            const address = wallet.getAddress();
            console.log('Created new wallet:');
            console.log('  Address:', address);
            console.log('  Public Key:', wallet.getPublicKey());
            console.log('  Full Address:', wallet.getFullAddress());

            try {
                const balance = await sdk.rpcService.getBalance(address);
                console.log('  Initial Balance:', balance);
                expect(balance).toBeDefined();
            } catch (error) {
                console.log('  Balance check failed (expected on new wallet):', error);
            }
        });

        it('should handle both private key string and signer interface', async () => {
            const wallet = sdk.importWalletFromPrivateKey(TEST_PRIVATE_KEY);
            const address = wallet.getAddress();

            expect(address.toLowerCase()).toBe(TEST_ADDRESS.toLowerCase());
            console.log('Wallet created from private key:');
            console.log('  Address:', address);
            console.log('  Full Address:', wallet.getFullAddress());

            const signer = wallet.getSigner();
            expect(signer).toBeDefined();
            expect(typeof signer.signTx).toBe('function');

            try {
                const balance = await sdk.rpcService.getBalance(address);
                console.log('  Balance:', balance);
            } catch (error) {
                console.log('  Balance check failed:', error);
            }
        });

        it('should maintain wallet state through reconnection', async () => {
          const wallet = sdk.createWallet();
          const address = wallet.getAddress();

          // Initial connection
          sdk.connectWallet(wallet);
          expect(sdk.isWalletConnected()).toBe(true);
          expect(sdk.getAddress()).toBe(address);

          // Reconnect
          sdk.connectWallet(wallet);
          expect(sdk.isWalletConnected()).toBe(true);
          expect(sdk.getAddress()).toBe(address);
        });

        it('should handle multiple wallets correctly', async () => {
            const wallet1 = sdk.createWallet();
            const wallet2 = sdk.createWallet();

            const address1 = wallet1.getAddress();
            const address2 = wallet2.getAddress();

            expect(address1).not.toBe(address2);

            sdk.connectWallet(wallet1);
            expect(sdk.getAddress()).toBe(address1);

            sdk.connectWallet(wallet2);
            expect(sdk.getAddress()).toBe(address2);

            console.log('Multiple wallets test:');
            console.log('  Wallet 1 Address:', address1);
            console.log('  Wallet 2 Address:', address2);
        });
        it('should handle different private key formats correctly', () => {
            // Has 0x prefix
            const withPrefix = `0x${TEST_PRIVATE_KEY}`;
            const wallet1 = sdk.importWalletFromPrivateKey(withPrefix);

            // No prefix
            const wallet2 = sdk.importWalletFromPrivateKey(TEST_PRIVATE_KEY);

            console.log('Private key format test:');
            console.log('  With prefix Address:', wallet1.getAddress());
            console.log('  Without prefix Address:', wallet2.getAddress());
            console.log('  Full Address (with prefix):', wallet1.getFullAddress());
            console.log('  Full Address (without prefix):', wallet2.getFullAddress());

            expect(wallet1.getAddress()).toBe(wallet2.getAddress());
            expect(wallet1.getAddress()).toBe(TEST_ADDRESS);
        });

        it('should handle different private key formats and values', () => {
            const validWallet = sdk.importWalletFromPrivateKey(TEST_PRIVATE_KEY);
            console.log("Private key values test:");
            console.log("  Valid key Address:", validWallet.getAddress());
            // Has 0x prefix
            const withPrefix = `0x${TEST_PRIVATE_KEY}`;
            const prefixWallet = sdk.importWalletFromPrivateKey(withPrefix);
            console.log("  Prefix key Address:", prefixWallet.getAddress());


            const shortKey = "1234";
            const shortWallet = sdk.importWalletFromPrivateKey(shortKey);
            console.log("  Short key Address:", shortWallet.getAddress());

            const longKey = TEST_PRIVATE_KEY + "extracharacters";
            const longWallet = sdk.importWalletFromPrivateKey(longKey);
            console.log("  Long key Address:", longWallet.getAddress());

            expect(validWallet.getAddress()).toBe(TEST_ADDRESS);
            expect(prefixWallet.getAddress()).toBe(TEST_ADDRESS);
            expect(shortWallet.getAddress()).toBeDefined();
            expect(shortWallet.getAddress()).not.toBe(TEST_ADDRESS);
            expect(longWallet.getAddress()).toBe(TEST_ADDRESS);
        });
    });
});