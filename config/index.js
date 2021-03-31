/* global */

const ethers = require('ethers');
const marketsConfig = require('./marketsConfig');
const modelsConfig = require('./modelsConfig');
const stakingConfig = require('./stakingConfig');

const mainnet = {
  anchorPeriod: 1800,
  closeFactorMantissa: '900000000000000000',
  maxAssets: '50',
  liquidationIncentiveMantissa: '1250000000000000000',
  modelsConfig: modelsConfig.mainnet,
  marketsConfig: marketsConfig.mainnet,
  stakingConfig: stakingConfig.rinkeby,
  compRate: "176000000000000000",
  comptrollerCompBalance: "10000" + "000000000000000000", // 10k BLO
  accThatGetsAllInitialBLO: "0x966da064E49F63D84d636D5a694038D831c75051"
};

const rinkeby = {
  anchorPeriod: 1800,
  closeFactorMantissa: '900000000000000000',
  maxAssets: '50',
  liquidationIncentiveMantissa: '1250000000000000000',
  modelsConfig: modelsConfig.rinkeby,
  marketsConfig: marketsConfig.rinkeby,
  stakingConfig: stakingConfig.rinkeby,
  compRate: "176000000000000000",
  comptrollerCompBalance: "10000" + "000000000000000000", // 10k BLO
  accThatGetsAllInitialBLO: "0x966da064E49F63D84d636D5a694038D831c75051"
};

const mainnet_fork = mainnet;
const localhost = mainnet;
const hardhat = mainnet;

module.exports = {
  mainnet,
  mainnet_fork,
  rinkeby,
  localhost,
  hardhat
};
