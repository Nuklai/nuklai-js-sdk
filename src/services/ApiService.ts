import { SDKConfig } from '../types/SDKConfig'

export class ApiService {
  constructor(protected config: SDKConfig) {}

  protected async makeRequest(
    apiUrl: string,
    method: string,
    params?: any,
    retries?: number,
    retryDelay?: number
  ): Promise<any> {
    console.log('Request URL:', apiUrl) // Debugging line to see the constructed URL

    const requestBody = {
      jsonrpc: '2.0',
      id: 1,
      method,
      params
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok && response.status === 429 && retries! > 0) {
        console.log(
          `Rate limit hit, retrying request... Retries left: ${retries}`
        )
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
        return this.makeRequest(
          apiUrl,
          method,
          params,
          retries! - 1,
          retryDelay! * 2
        )
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (retries! > 0) {
        console.log(`Request failed, retrying... Retries left: ${retries}`)
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
        return this.makeRequest(
          apiUrl,
          method,
          params,
          retries! - 1,
          retryDelay! * 2
        )
      }
      console.error(`Error fetching ${method}:`, error)
      throw error
    }
  }
}
