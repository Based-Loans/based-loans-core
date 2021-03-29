import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import 'dotenv/config';
import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-gas-reporter';

const privateKey = process.env.DEV1_PRIVATE_KEY;
const INFURA_ID = process.env.INFURA_ID;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/" + INFURA_ID,
        blockNumber: 12134782
        // url: "https://rinkeby.infura.io/v3/" + INFURA_ID,
        // blockNumber: 8208002,
      }
    },
    localhost: {
      url: "http://localhost:8545",
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/" + INFURA_ID,
      accounts: [`${privateKey}`]
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/" + INFURA_ID,
      accounts: [`${privateKey}`],
      // gasPrice: 90000000000
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.5.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  namedAccounts: {
    deployer: 0,
    trader: 1,
    weth_faucet: 9
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10,
  },
  mocha: {
    timeout: 0,
  },
  paths: {
    sources: "./contracts",
  }
};

export default config;
