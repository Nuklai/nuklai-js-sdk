import { fungibleTokenExamples } from "./fungible_tokens";
import { nonFungibleTokenExamples } from "./non_fungible_token";
import { datasetExamples } from "./dataset";
import { marketplaceExamples } from "./marketplace";

async function runAllExamples() {
  console.log("Running FT examples...");
  await fungibleTokenExamples();

  console.log("\nRunning NFT examples...");
  await nonFungibleTokenExamples();

  console.log("\nRunning Dataset examples...");
  await datasetExamples();

  console.log("\nRunning Marketplace examples...");
  await marketplaceExamples();
}

runAllExamples().catch(console.error);
