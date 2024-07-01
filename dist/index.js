"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NuklaiSDK = exports.services = exports.consts = exports.common = exports.actions = void 0;
exports.actions = __importStar(require("./actions"));
exports.common = __importStar(require("./common"));
exports.consts = __importStar(require("./constants"));
exports.services = __importStar(require("./services"));
var sdk_1 = require("./sdk");
Object.defineProperty(exports, "NuklaiSDK", { enumerable: true, get: function () { return sdk_1.NuklaiSDK; } });
//# sourceMappingURL=index.js.map