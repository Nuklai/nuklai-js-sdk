export class Codec {
  private buffer: Uint8Array[] = []

  addNumber(value: number): void {
    const bytes = new Uint8Array(4)
    new DataView(bytes.buffer).setUint32(0, value, true)
    this.buffer.push(bytes)
  }

  addBigInt(value: bigint): void {
    const bytes = new ArrayBuffer(8)
    new DataView(bytes).setBigUint64(0, value, true)
    this.buffer.push(new Uint8Array(bytes))
  }

  addString(value: string): void {
    const strBytes = new TextEncoder().encode(value)
    this.addNumber(strBytes.length)
    this.buffer.push(strBytes)
  }

  addArray(arr: Uint8Array[]): void {
    this.addNumber(arr.length)
    arr.forEach((item) => this.buffer.push(item))
  }

  addBytes(bytes: Uint8Array): void {
    this.addNumber(bytes.length)
    this.buffer.push(bytes)
  }

  getNumber(): number {
    const bytes = this.buffer.shift()
    if (!bytes) throw new Error('Buffer is empty')
    return new DataView(bytes.buffer).getUint32(0, true)
  }

  getBigInt(): bigint {
    const bytes = this.buffer.shift()
    if (!bytes) throw new Error('Buffer is empty')
    return new DataView(bytes.buffer).getBigUint64(0, true)
  }

  getString(): string {
    const length = this.getNumber()
    const strBytes = this.buffer.shift()
    if (!strBytes) throw new Error('Buffer is empty')
    return new TextDecoder().decode(strBytes.slice(0, length))
  }

  getArray<T>(callback: (bytes: Uint8Array) => T): T[] {
    const length = this.getNumber()
    const arr: T[] = []
    for (let i = 0; i < length; i++) {
      const itemBytes = this.buffer.shift()
      if (!itemBytes) throw new Error('Buffer is empty')
      arr.push(callback(itemBytes))
    }
    return arr
  }

  getBytes(): Uint8Array {
    const length = this.getNumber()
    const bytes = this.buffer.shift()
    if (!bytes) throw new Error('Buffer is empty')
    return bytes.slice(0, length)
  }

  toBytes(): Uint8Array {
    const totalLength = this.buffer.reduce((sum, curr) => sum + curr.length, 0)
    const combined = new Uint8Array(totalLength)
    let offset = 0
    this.buffer.forEach((curr) => {
      combined.set(curr, offset)
      offset += curr.length
    })
    return combined
  }

  constructor(bytes?: Uint8Array) {
    if (bytes) {
      this.buffer = [bytes]
    }
  }
}
