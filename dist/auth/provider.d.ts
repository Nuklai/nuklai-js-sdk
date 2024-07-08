import { Auth, AuthFactory } from './auth';
export type AuthType = 'bls' | 'ed25519';
export declare function getAuthFactory(authType: AuthType, privateKeyString: string): AuthFactory;
export declare function getAuth(authType: AuthType, signer: Uint8Array, signature: Uint8Array): Auth;
