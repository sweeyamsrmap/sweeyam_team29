require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: ["4f0ab5e2d8c6b761d512a5a1d20810dbecee00d1228ea5974957c479ebdf9773"],
      chainId: 11155111,
    },
  },
};
