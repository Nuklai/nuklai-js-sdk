import { runManualTests } from "../tests/rpc.test";

console.log("Starting RPC tests...");
runManualTests()
  .then(() => console.log("Tests completed"))
  .catch(console.error);
