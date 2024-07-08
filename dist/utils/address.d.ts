import { TypeSymbols } from '@avalabs/avalanchejs';
export declare class Address {
    private readonly address;
    _type: TypeSymbols;
    constructor(address: Uint8Array);
    static fromBytes(buf: Uint8Array): [Address, Uint8Array];
    toJSON(hrp?: string): `${Lowercase<string>}1${string}`;
    static fromString(addr: string): Address;
    static fromHex(hex: string): Address;
    toHex(): string;
    toBytes(): Uint8Array;
    toString(hrp?: string): `${Lowercase<string>}1${string}`;
    value(): `${Lowercase<string>}1${string}`;
    static newAddress(authTypeID: number, publicKeyBytes: Uint8Array): Address;
    static formatAddress(address: Uint8Array): string;
    static parseAddress(address: string): Uint8Array;
}
