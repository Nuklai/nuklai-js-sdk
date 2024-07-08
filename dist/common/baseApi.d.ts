import { JrpcProvider } from './rpc';
export declare abstract class Api {
    protected path: string;
    protected base?: string | undefined;
    protected fetchOptions?: RequestInit | undefined;
    protected rpcProvider: JrpcProvider;
    constructor(baseURL?: string, path?: string, base?: string | undefined, fetchOptions?: RequestInit | undefined);
    setFetchOptions(options: RequestInit | undefined): void;
    protected getMethodName: (methodName: string) => string;
    protected callRpc: <T>(methodName: string, params?: Array<Record<string, any>> | Record<string, any>) => Promise<T>;
}
