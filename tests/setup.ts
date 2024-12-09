// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { jest } from "@jest/globals";

global.console = {
  ...console,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
};
