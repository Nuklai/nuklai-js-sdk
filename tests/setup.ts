// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

// Preserve existing console methods and override as needed
global.console = {
  ...console,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug
}
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}
