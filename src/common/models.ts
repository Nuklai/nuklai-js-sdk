// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { common } from '@nuklai/hyperchain-sdk'

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

export type EmissionBalancer = {
  maxSupply: number
  emissionAddress: string
}

export type Genesis = common.Genesis & {
  emissionBalancer: EmissionBalancer
}

export type GetGenesisInfoResponse = {
  genesis: Genesis
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

export interface GetNFTInfoParams {
  nftID: string
}

export interface GetNFTInfoResponse {
  assetID: string
  tokenID: string
  owner: string
  metadata: string
  uri: string
}

export interface BurnAssetFTParams {
  asset: string
  amount: number
}

export interface BurnAssetNFTParams {
  asset: string
  nftID: string
}