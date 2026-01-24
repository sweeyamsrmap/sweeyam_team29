const hre = require("hardhat");

async function main() {
  console.log("Deploying ESGChain contract...");

  const ESGChain = await hre.ethers.getContractFactory("ESGChain");
  
  console.log("Sending deployment transaction...");
  const esgChain = await ESGChain.deploy();
  
  console.log("Waiting for deployment...");
  await esgChain.deployed();
  
  console.log("\n✅ ESGChain deployed successfully!");
  console.log("📍 Contract Address:", esgChain.address);
  console.log("\n📝 Update your .env file:");
  console.log("VITE_CONTRACT_ADDRESS=" + esgChain.address);
  console.log("\n🔗 View on Etherscan:");
  console.log(`https://sepolia.etherscan.io/address/${esgChain.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
