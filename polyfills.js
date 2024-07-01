// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Buffer } from "buffer";
import process from "process";
import events from "events";

if (typeof globalThis !== "undefined") {
  globalThis.Buffer = Buffer;
  globalThis.process = process;
  globalThis.events = events;
} else if (typeof global !== "undefined") {
  global.Buffer = Buffer;
  global.process = process;
  global.events = events;
} else if (typeof window !== "undefined") {
  window.Buffer = Buffer;
  window.process = process;
  window.events = events;
}
