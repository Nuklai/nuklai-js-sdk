// codec.ts

import { INT64_LEN, INT_LEN, BYTE_LEN } from "../constants/consts";

export class Codec {
  private buffer: Uint8Array;
  private limit: number | bigint;
  private offset: number;

  constructor(bytes?: Uint8Array, limit?: number | bigint) {
    if (bytes) {
      this.buffer = bytes;
      this.offset = 0;
    } else {
      this.buffer = new Uint8Array();
      this.offset = 0;
    }
    this.limit = limit || 0;
  }

  static newWriter(initialBufferSize: number, limit: number | bigint): Codec {
    return new Codec(new Uint8Array(initialBufferSize), limit);
  }

  static newReader(bytes: Uint8Array, limit: number | bigint): Codec {
    return new Codec(bytes, limit);
  }

  private checkLimit(size: number): void {
    if (this.limit && this.offset + size > this.limit) {
      throw new Error("Buffer limit exceeded");
    }
  }

  addNumber(value: number): void {
    this.checkLimit(INT_LEN);
    new DataView(this.buffer.buffer).setUint32(this.offset, value, true);
    this.offset += INT_LEN;
  }

  addBigInt(value: bigint): void {
    this.checkLimit(INT64_LEN);
    new DataView(this.buffer.buffer).setBigUint64(this.offset, value, true);
    this.offset += INT64_LEN;
  }

  addString(value: string): void {
    const strBytes = new TextEncoder().encode(value);
    this.addNumber(strBytes.length);
    this.checkLimit(strBytes.length);
    this.buffer.set(strBytes, this.offset);
    this.offset += strBytes.length;
  }

  addArray(arr: Uint8Array[]): void {
    this.addNumber(arr.length);
    arr.forEach((item) => {
      this.checkLimit(item.length);
      this.buffer.set(item, this.offset);
      this.offset += item.length;
    });
  }

  addBytes(bytes: Uint8Array): void {
    this.checkLimit(bytes.length);
    this.buffer.set(bytes, this.offset);
    this.offset += bytes.length;
  }

  addBool(value: boolean): void {
    this.addNumber(value ? 1 : 0);
  }

  addFixedBytes(size: number, bytes: Uint8Array): void {
    this.checkLimit(size);
    this.buffer.set(bytes, this.offset);
    this.offset += size;
  }

  addByte(value: number): void {
    this.checkLimit(BYTE_LEN);
    this.buffer[this.offset] = value;
    this.offset += BYTE_LEN;
  }

  getNumber(): number {
    const value = new DataView(this.buffer.buffer).getUint32(this.offset, true);
    this.offset += INT_LEN;
    return value;
  }

  getBigInt(): bigint {
    const value = new DataView(this.buffer.buffer).getBigUint64(
      this.offset,
      true
    );
    this.offset += INT64_LEN;
    return value;
  }

  getString(): string {
    const length = this.getNumber();
    const value = new TextDecoder().decode(
      this.buffer.slice(this.offset, this.offset + length)
    );
    this.offset += length;
    return value;
  }

  getArray<T>(callback: (bytes: Uint8Array) => T): T[] {
    const length = this.getNumber();
    const arr: T[] = [];
    for (let i = 0; i < length; i++) {
      arr.push(callback(this.getBytes()));
    }
    return arr;
  }

  getBytes(): Uint8Array {
    const length = this.getNumber();
    const result = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return result;
  }

  getBool(): boolean {
    return this.getNumber() === 1;
  }

  getFixedBytes(size: number): Uint8Array {
    const result = this.buffer.slice(this.offset, this.offset + size);
    this.offset += size;
    return result;
  }

  getByte(): number {
    const value = this.buffer[this.offset];
    this.offset += BYTE_LEN;
    return value;
  }

  toBytes(): Uint8Array {
    return this.buffer.slice(0, this.offset);
  }

  getOffset(): number {
    return this.offset;
  }

  hasError(): boolean {
    return false;
  }

  getError(): Error | null {
    return null;
  }
}
