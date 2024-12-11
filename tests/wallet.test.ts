// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { beforeAll, describe, expect, it } from '@jest/globals';
import { NuklaiSDK } from '../src/sdk';
import { NuklaiWallet } from '../src/wallet';
import { bytesToHex } from '@noble/hashes/utils';
import { TEST_CONFIG } from './config';

const API_HOST = TEST_CONFIG.API_HOST;
const TEST_PRIVATE_KEY = TEST_CONFIG.TEST_PRIVATE_KEY;
const TEST_ADDRESS = TEST_CONFIG.TEST_ADDRESS.replace('00', '');
const NAI_ASSET_ADDRESS = TEST_CONFIG.NAI_ASSET_ADDRESS.replace('00', '');

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
                expect(balance).toBeDefined();
                expect(typeof balance).toBe('string');
                console.log('  Raw Initial Balance:', balance);
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
        it('should verify signer is properly setup for transaction signing', () => {
            const wallet = sdk.importWalletFromPrivateKey(TEST_PRIVATE_KEY);
            const address = wallet.getAddress();
            const signer = wallet.getSigner();

            console.log('Wallet signer test:');
            console.log('  Wallet Address:', address);
            console.log('  Full Address:', wallet.getFullAddress());
            console.log('  Public Key:', wallet.getPublicKey());
            console.log('  Signer Status:', signer ? 'Successfully created' : 'Failed to create');
            console.log('  Signer Public Key:', bytesToHex(signer.getPublicKey()));
            console.log('  Has SignTx Function:', typeof signer.signTx === 'function' ? 'Yes' : 'No');
            console.log('  Signer Matches Wallet:', wallet.getSigner() === signer ? 'Yes' : 'No');

            expect(signer).toBeDefined();
            expect(typeof signer.signTx).toBe('function');
            expect(wallet.getSigner()).toBe(signer);
            expect(bytesToHex(signer.getPublicKey())).toBe(wallet.getPublicKey());
        });
    });
});