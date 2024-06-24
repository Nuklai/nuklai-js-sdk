// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import {
  MAINNET_PUBLIC_API_BASE_URL,
  NUKLAI_CHAIN_ENDPOINT,
  NUKLAI_COREAPI_PATH
} from '../constants/endpoints'
import { JrpcProvider } from './rpc'

export abstract class Api {
  protected rpcProvider: JrpcProvider

  constructor(
    baseURL: string = MAINNET_PUBLIC_API_BASE_URL,
    protected path: string = `${NUKLAI_CHAIN_ENDPOINT}/${NUKLAI_COREAPI_PATH}`,
    protected base?: string,
    protected fetchOptions?: RequestInit
  ) {
    this.rpcProvider = new JrpcProvider(baseURL + path)
  }

  setFetchOptions(options: RequestInit | undefined) {
    this.fetchOptions = options
  }

  protected getMethodName = (methodName: string) => {
    if (!this.base) {
      return methodName
    }
    return `${this.base}.${methodName}`
  }

  protected callRpc = <T>(
    methodName: string,
    params?: Array<Record<string, any>> | Record<string, any>
  ): Promise<T> =>
    this.rpcProvider.callMethod<T>(
      this.getMethodName(methodName),
      params,
      this.fetchOptions
    )
}
