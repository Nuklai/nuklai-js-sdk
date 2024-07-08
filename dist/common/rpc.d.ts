export type RpcCallOptions = {
    headers?: Record<string, string>;
};
export declare class JrpcProvider {
    private readonly url;
    private reqId;
    constructor(url: string);
    callMethod<T>(method: string, parameters?: Array<Record<string, any>> | Record<string, any>, fetchOptions?: RequestInit): Promise<T>;
}
