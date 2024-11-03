import { runManualTests } from "../tests/rpc.test";

async function main() {
  console.log("Starting manual RPC tests...");
  try {
    await runManualTests();
    console.log("Tests completed successfully");
  } catch (error) {
    console.error("Tests failed:", error);
    process.exit(1);
  }
}

main();
