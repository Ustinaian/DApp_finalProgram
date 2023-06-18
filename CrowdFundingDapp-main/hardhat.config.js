
require("@nomiclabs/hardhat-waffle")
require("dotenv").config();
const {ALCHEMY_URL,PRIVATE_KEY} = process.env;
module.exports = {
  solidity: "0.8.9",
  networks:{
    sepolia:{
      url:`${ALCHEMY_URL}`,
      accounts:[`0x${PRIVATE_KEY}`]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./crowdfunding/src/artifacts"
  },
};
