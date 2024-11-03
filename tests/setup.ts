import { jest } from "@jest/globals";

global.console = {
  ...console,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
};
