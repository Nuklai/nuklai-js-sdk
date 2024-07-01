"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = void 0;
const hyperchain_sdk_1 = require("@nuklai/hyperchain-sdk");
class Transfer extends hyperchain_sdk_1.actions.Transfer {
    constructor(to, asset, value, memo) {
        super(to, asset, value, memo);
    }
}
exports.Transfer = Transfer;
//# sourceMappingURL=transfer.js.map