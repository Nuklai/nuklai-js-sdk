import { INT64_LEN, INT_LEN, UINT32_LEN, BYTE_LEN } from "constants/consts";

export class Codec {
  private buffer: Uint8Array[];
  private limit: number | bigint;
  private currentSize: number;
  private offset: number;

  constructor(bytes?: Uint8Array, limit?: number | bigint) {
    if (bytes) {
      this.buffer = [bytes];
      this.currentSize = bytes.length;
      this.offset = bytes.length;
    } else {
      this.buffer = [];
      this.currentSize = 0;
      this.offset = 0;
    }
    this.limit = limit || 0;
  }

  static newWriter(initialBufferSize: number, limit: number | bigint): Codec {
    const codec = new Codec(undefined, limit);
    codec.buffer.push(new Uint8Array(initialBufferSize));
    codec.offset = 0;
    return codec;
  }

  static newReader(bytes: Uint8Array, limit: number | bigint): Codec {
    return new Codec(bytes, limit);
  }

  private checkLimit(size: number): void {
    if (this.limit && this.currentSize + size > this.limit) {
      throw new Error("Buffer limit exceeded");
    }
  }

  addNumber(value: number): void {
    this.checkLimit(INT_LEN);
    const bytes = new Uint8Array(INT_LEN);
    new DataView(bytes.buffer).setUint32(0, value, true);
    this.buffer.push(bytes);
    this.currentSize += INT_LEN;
    this.offset += INT_LEN;
  }

  addBigInt(value: bigint): void {
    this.checkLimit(INT64_LEN);
    const bytes = new ArrayBuffer(INT64_LEN);
    new DataView(bytes).setBigUint64(0, value, true);
    this.buffer.push(new Uint8Array(bytes));
    this.currentSize += INT64_LEN;
    this.offset += INT64_LEN;
  }

  addString(value: string): void {
    const strBytes = new TextEncoder().encode(value);
    this.addNumber(strBytes.length);
    this.checkLimit(strBytes.length);
    this.buffer.push(strBytes);
    this.currentSize += strBytes.length;
    this.offset += strBytes.length;
  }

  addArray(arr: Uint8Array[]): void {
    this.addNumber(arr.length);
    arr.forEach((item) => {
      this.checkLimit(item.length);
      this.buffer.push(item);
      this.currentSize += item.length;
      this.offset += item.length;
    });
  }

  addBytes(bytes: Uint8Array): void {
    this.addNumber(bytes.length);
    this.checkLimit(bytes.length);
    this.buffer.push(bytes);
    this.currentSize += bytes.length;
    this.offset += bytes.length;
  }

  addBool(value: boolean): void {
    this.addNumber(value ? 1 : 0);
  }

  addFixedBytes(bytes: Uint8Array): void {
    this.checkLimit(bytes.length);
    this.buffer.push(bytes);
    this.currentSize += bytes.length;
    this.offset += bytes.length;
  }

  addByte(value: number): void {
    this.checkLimit(BYTE_LEN);
    const bytes = new Uint8Array(BYTE_LEN);
    bytes[0] = value;
    this.buffer.push(bytes);
    this.currentSize += BYTE_LEN;
    this.offset += BYTE_LEN;
  }

  getNumber(): number {
    const bytes = this.buffer.shift();
    if (!bytes) throw new Error("Buffer is empty");
    this.currentSize -= INT_LEN;
    this.offset -= INT_LEN;
    return new DataView(bytes.buffer).getUint32(0, true);
  }

  getBigInt(): bigint {
    const bytes = this.buffer.shift();
    if (!bytes) throw new Error("Buffer is empty");
    this.currentSize -= INT64_LEN;
    this.offset -= INT64_LEN;
    return new DataView(bytes.buffer).getBigUint64(0, true);
  }

  getString(): string {
    const length = this.getNumber();
    const strBytes = this.buffer.shift();
    if (!strBytes) throw new Error("Buffer is empty");
    this.currentSize -= length;
    this.offset -= length;
    return new TextDecoder().decode(strBytes.slice(0, length));
  }

  getArray<T>(callback: (bytes: Uint8Array) => T): T[] {
    const length = this.getNumber();
    const arr: T[] = [];
    for (let i = 0; i < length; i++) {
      const itemBytes = this.buffer.shift();
      if (!itemBytes) throw new Error("Buffer is empty");
      this.currentSize -= itemBytes.length;
      this.offset -= itemBytes.length;
      arr.push(callback(itemBytes));
    }
    return arr;
  }

  getBytes(): Uint8Array {
    const length = this.getNumber();
    const bytes = this.buffer.shift();
    if (!bytes) throw new Error("Buffer is empty");
    this.currentSize -= length;
    this.offset -= length;
    return bytes.slice(0, length);
  }

  getBool(): boolean {
    return this.getNumber() === 1;
  }

  getFixedBytes(size: number): Uint8Array {
    const bytes = this.buffer.shift();
    if (!bytes) throw new Error("Buffer is empty");
    this.currentSize -= size;
    this.offset -= size;
    return bytes.slice(0, size);
  }

  getByte(): number {
    const bytes = this.buffer.shift();
    if (!bytes) throw new Error("Buffer is empty");
    this.currentSize -= BYTE_LEN;
    this.offset -= BYTE_LEN;
    return bytes[0];
  }

  toBytes(): Uint8Array {
    const totalLength = this.buffer.reduce((sum, curr) => sum + curr.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    this.buffer.forEach((curr) => {
      combined.set(curr, offset);
      offset += curr.length;
    });
    return combined;
  }

  getOffset(): number {
    return this.offset;
  }

  hasError(): boolean {
    // Add logic for error handling if necessary
    return false;
  }

  getError(): Error | null {
    // Add logic for error handling if necessary
    return null;
  }
}
