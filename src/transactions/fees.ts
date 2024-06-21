import { Action } from "../actions/action";
import { AuthFactory } from "../auth/auth";
import bigInt from "big-integer";
import { BaseTxSize } from "./baseTx";
import { BYTE_LEN, UINT8_LEN } from "../constants/consts";
import { STORAGE_BALANCE_CHUNKS } from "../constants/nuklaivm";
import { Genesis } from "../common/nuklaiApiModels";

type Dimension = number[];
const FeeDimensions: number = 5;

function mul64(a: number, b: number): bigint {
  return BigInt(a) * BigInt(b);
}

function add64(a: bigint, b: bigint): bigint {
  return a + b;
}

export function mulSum(a: Dimension, b: Dimension): [bigint, Error?] {
  let val = 0n;
  for (let i = 0; i < FeeDimensions; i++) {
    try {
      const v = mul64(a[i], b[i]);
      val = add64(val, v);
    } catch (err) {
      return [0n, err as Error];
    }
  }
  return [val];
}

export function estimateUnits(
  genesisInfo: Genesis,
  actions: Action[],
  authFactory: AuthFactory
): Dimension {
  let bandwidth = BaseTxSize;
  let stateKeysMaxChunks = [] as number[];
  let computeOp = bigInt(genesisInfo.baseUnits);
  let readsOp = bigInt(0);
  let allocatesOp = bigInt(0);
  let writesOp = bigInt(0);

  // Calculate over action/auth
  bandwidth += UINT8_LEN;
  actions.forEach((action) => {
    bandwidth += BYTE_LEN + action.size();
    const actionStateKeysMaxChunks = action.stateKeysMaxChunks();
    stateKeysMaxChunks = [...stateKeysMaxChunks, ...actionStateKeysMaxChunks];
    computeOp = computeOp.add(action.computeUnits());
  });

  bandwidth += BYTE_LEN + authFactory.bandwidth();
  const sponsorStateKeyMaxChunks = [STORAGE_BALANCE_CHUNKS];
  stateKeysMaxChunks = [...stateKeysMaxChunks, ...sponsorStateKeyMaxChunks];
  computeOp = computeOp.add(authFactory.computeUnits());

  // Estimate compute costs
  const compute = computeOp.valueOf();

  // Estimate storage costs
  for (const maxChunks of stateKeysMaxChunks) {
    // Compute key costs
    readsOp = readsOp.add(genesisInfo.storageKeyReadUnits);
    allocatesOp = allocatesOp.add(genesisInfo.storageKeyAllocateUnits);
    writesOp = writesOp.add(genesisInfo.storageKeyWriteUnits);

    // Compute value costs
    readsOp = readsOp.add(
      bigInt(maxChunks).multiply(bigInt(genesisInfo.storageValueReadUnits))
    );
    allocatesOp = allocatesOp.add(
      bigInt(maxChunks).multiply(bigInt(genesisInfo.storageValueAllocateUnits))
    );
    writesOp = writesOp.add(
      bigInt(maxChunks).multiply(bigInt(genesisInfo.storageValueWriteUnits))
    );
  }

  const reads = readsOp.valueOf();
  const allocates = allocatesOp.valueOf();
  const writes = writesOp.valueOf();

  return [bandwidth, compute, reads, allocates, writes] as Dimension;
}
