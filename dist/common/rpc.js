"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.JrpcProvider = void 0;
class JrpcProvider {
    constructor(url) {
        this.url = url;
        this.reqId = 0;
    }
    async callMethod(method, parameters, fetchOptions) {
        const body = {
            jsonrpc: '2.0',
            id: this.reqId++,
            method,
            params: parameters
        };
        const resp = await fetch(this.url, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions?.headers
            }
        })
            .then(async (r) => r.json())
            .then((data) => data);
        if (resp.error)
            throw new Error(resp.error.message);
        return resp.result;
    }
}
exports.JrpcProvider = JrpcProvider;
//# sourceMappingURL=rpc.js.map