import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { bytesToHex } from '@noble/hashes/utils';
import { ed25519 } from '@noble/curves/ed25519';
import {NuklaiSDK} from "../src";
import {NuklaiWallet} from "../src/wallet";

const API_HOST = 'http://127.0.0.1:9650';
const TEST_PRIVATE_KEY = '323b1d8f4eed5f0da9da93071b034f2dce9d2d22692c172f3cb252a64ddfafd01b057de320297c29ad0c1f589ea216869cf1938d88c9fbd70d6748323dbf2fa7';
const TEST_ADDRESS = '00c4cb545f748a28770042f893784ce85b107389004d6a0e0d6d7518eeae1292d9';
const NAI_ASSET_ADDRESS = '00cf77495ce1bdbf11e5e45463fad5a862cb6cc0a20e00e658c4ac3355dcdc64bb';

describe('NuklaiSDK Wallet Integration', () => {
    let sdk: NuklaiSDK;

    beforeAll(async () => {
        sdk = new NuklaiSDK(API_HOST);
    });

    describe('SDK Wallet Management', () => {
        it('should create a new random wallet', () => {
            const wallet = sdk.createWallet();

            expect(wallet).toBeInstanceOf(NuklaiWallet);
            expect(wallet.getAddress()).toBeDefined();
            expect(sdk.isWalletConnected()).toBe(true);

            console.log('Created new wallet:');
            console.log('  Address:', wallet.getAddress());
            console.log('  Public Key:', wallet.getPublicKey());
        });

        it('should import wallet from private key', () => {
            const wallet = sdk.importWalletFromPrivateKey(TEST_PRIVATE_KEY);

            expect(wallet).toBeInstanceOf(NuklaiWallet);
            expect(wallet.getAddress()).toBe(TEST_ADDRESS);
            expect(sdk.isWalletConnected()).toBe(true);

            console.log('Imported wallet:');
            console.log('  Address:', wallet.getAddress());
            console.log('  Public Key:', wallet.getPublicKey());
        });

        it('should disconnect and reconnect wallet', () => {
            const wallet = sdk.createWallet();
            const address = wallet.getAddress();

            expect(sdk.isWalletConnected()).toBe(true);
            expect(sdk.getAddress()).toBe(address);

            // Create new wallet (should replace old one)
            const newWallet = sdk.createWallet();
            expect(sdk.getAddress()).toBe(newWallet.getAddress());
            expect(sdk.getAddress()).not.toBe(address);

            console.log('Wallet replacement:');
            console.log('  Old Address:', address);
            console.log('  New Address:', newWallet.getAddress());
        });
    });

    describe('Wallet Operations', () => {
        let wallet: NuklaiWallet;

        beforeAll(() => {
            wallet = sdk.importWalletFromPrivateKey(TEST_PRIVATE_KEY);
        });

        it('should check wallet balance', async () => {
            const balance = await sdk.rpcService.getBalance(wallet.getAddress());
            expect(balance).toBeDefined();

            console.log('Wallet balance:', balance);
        });

        it('should make a transfer', async () => {
            const recipientWallet = sdk.createWallet();
            const transferAmount = BigInt(1);

            const result = await sdk.rpcService.transfer(
                recipientWallet.getAddress(),
                NAI_ASSET_ADDRESS,
                transferAmount,
                'Test wallet transfer'
            );

            expect(result.result.success).toBe(true);

            console.log('Transfer result:', {
                from: wallet.getAddress(),
                to: recipientWallet.getAddress(),
                amount: transferAmount.toString(),
                success: result.result.success
            });
        });
    });
});

describe('NuklaiWallet Unit Tests', () => {
    describe('Wallet Creation', () => {
        it('should create wallet with random private key', () => {
            const wallet = NuklaiWallet.createRandom();

            expect(wallet).toBeInstanceOf(NuklaiWallet);
            expect(wallet.getAddress()).toBeDefined();
            expect(wallet.getAddress()).toMatch(/^0x[0-9a-fA-F]{74}$/);

            console.log('Random wallet created:');
            console.log('  Address:', wallet.getAddress());
            console.log('  Public Key:', wallet.getPublicKey());
        });

        it('should create wallet from private key', () => {
            const wallet = NuklaiWallet.fromPrivateKey(TEST_PRIVATE_KEY);

            expect(wallet.getAddress()).toBe(TEST_ADDRESS);

            console.log('Private key wallet:');
            console.log('  Address:', wallet.getAddress());
            console.log('  Public Key:', wallet.getPublicKey());
        });

        it('should create multiple unique wallets', () => {
            const wallet1 = NuklaiWallet.createRandom();
            const wallet2 = NuklaiWallet.createRandom();

            expect(wallet1.getAddress()).not.toBe(wallet2.getAddress());
            expect(wallet1.getPublicKey()).not.toBe(wallet2.getPublicKey());

            console.log('Multiple wallets:');
            console.log('  Wallet 1 Address:', wallet1.getAddress());
            console.log('  Wallet 2 Address:', wallet2.getAddress());
        });
    });

    describe('Address and Key Management', () => {
        let wallet: NuklaiWallet;

        beforeAll(() => {
            wallet = NuklaiWallet.fromPrivateKey(TEST_PRIVATE_KEY);
        });

        it('should generate valid address format', () => {
            const address = wallet.getAddress();
            expect(address).toMatch(/^0x[0-9a-fA-F]{74}$/);
            expect(address).toBe(TEST_ADDRESS);
        });

        it('should provide address in both hex and bytes format', () => {
            const addressHex = wallet.getAddress();
            const addressBytes = wallet.getAddressBytes();

            expect(addressHex).toBe(TEST_ADDRESS);
            expect(bytesToHex(addressBytes)).toBe(TEST_ADDRESS.slice(2, -8)); // Remove 0x prefix and checksum

            console.log('Address formats:');
            console.log('  Hex:', addressHex);
            console.log('  Bytes:', bytesToHex(addressBytes));
        });

        it('should provide working signer interface', async () => {
            const signer = wallet.getSigner();
            const message = new Uint8Array([1, 2, 3, 4, 5]);
            const pubKey = signer.getPublicKey();

            expect(ed25519.getPublicKey(TEST_PRIVATE_KEY)).toEqual(pubKey);

            console.log('Signer verification:');
            console.log('  Public Key:', bytesToHex(pubKey));
        });
    });
});