export type GetBalanceParams = {
  address: string
  asset: string
}

export type GetBalanceResponse = {
  amount: number
}

export type GetAssetInfoParams = {
  asset: string
}

export type GetAssetInfoResponse = {
  symbol: Uint8Array
  decimals: number
  metadata: Uint8Array
  supply: number
  owner: string
  warp: boolean
}

export type EmissionAccount = {
  address: Uint8Array
  accumulatedReward: number
}

export type EpochTracker = {
  baseAPR: number
  baseValidators: number
  epochLength: number
}

export type GetEmissionInfoResponse = {
  currentBlockHeight: number
  totalSupply: number
  maxSupply: number
  totalStaked: number
  rewardsPerEpoch: number
  emissionAccount: EmissionAccount
  epochTracker: EpochTracker
}

export type Validator = {
  isActive: boolean
  nodeID: string
  publicKey: Uint8Array
  stakedAmount: number
  accumulatedStakedReward: number
  delegationFeeRate: number
  delegatedAmount: number
  accumulatedDelegatedReward: number
}

export type GetValidatorsResponse = {
  validators: Validator[]
}

export type GetValidatorStakeParams = {
  nodeID: string
}

export type GetValidatorStakeResponse = {
  stakeStartBlock: number
  stakeEndBlock: number
  stakedAmount: number
  delegationFeeRate: number
  rewardAddress: string
  ownerAddress: string
}

export type GetUserStakeParams = {
  owner: string
  nodeID: string
}

export type GetUserStakeResponse = {
  stakeStartBlock: number
  stakedAmount: number
  rewardAddress: string
  ownerAddress: string
}

export type CustomAllocation = {
  address: string
  balance: number
}

export type EmissionBalancer = {
  totalSupply: number
  maxSupply: number
  emissionAddress: string
}

export type Genesis = {
  stateBranchFactor: number
  minBlockGap: number
  minEmptyBlockGap: number
  minUnitPrice: Uint8Array
  unitPriceChangeDenominator: Uint8Array
  windowTargetUnits: Uint8Array
  maxBlockUnits: Uint8Array
  validityWindow: number
  baseUnits: number
  baseWarpUnits: number
  warpUnitsPerSigner: number
  outgoingWarpComputeUnits: number
  storageKeyReadUnits: number
  storageValueReadUnits: number
  storageKeyAllocateUnits: number
  storageValueAllocateUnits: number
  storageKeyWriteUnits: number
  storageValueWriteUnits: number
  customAllocation: CustomAllocation[]
  emissionBalancer: EmissionBalancer
}

export type GetGenesisInfoResponse = {
  genesis: Genesis
}

export type GetLoanInfoParams = {
  destination: string
  asset: string
}

export type GetLoanInfoResponse = {
  amount: number
}

export type GetTransactionInfoParams = {
  txId: string
}

export type GetTransactionInfoResponse = {
  timestamp: number
  success: boolean
  units: Uint8Array
  fee: number
}
