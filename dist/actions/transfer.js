// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
import { actions } from '@nuklai/hyperchain-sdk';
export class Transfer extends actions.Transfer {
    constructor(to, asset, value, memo) {
        super(to, asset, value, memo);
    }
}
//# sourceMappingURL=transfer.js.map