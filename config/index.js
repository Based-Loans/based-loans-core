/* global */

const ethers = require('ethers');
const marketsConfig = require('./marketsConfig');
const modelsConfig = require('./modelsConfig');
const tokenDistribution = require('./tokenDistribution');

const mainnet = {
  anchorPeriod: 900, // 15 min
  closeFactorMantissa: '900000000000000000',
  maxAssets: '50',
  liquidationIncentiveMantissa: '1250000000000000000',
  modelsConfig: modelsConfig.mainnet,
  marketsConfig: marketsConfig.mainnet,
  tokenDistribution: tokenDistribution.mainnet,
  compRate: "176000000000000000",
  accThatGetsAllInitialBLO: "0x966da064E49F63D84d636D5a694038D831c75051",
  timelockPendingAdminETA: 1612825772
};

const rinkeby = {
  anchorPeriod: 900, // 15 min
  closeFactorMantissa: '900000000000000000',
  maxAssets: '50',
  liquidationIncentiveMantissa: '1250000000000000000',
  modelsConfig: modelsConfig.rinkeby,
  marketsConfig: marketsConfig.rinkeby,
  tokenDistribution: tokenDistribution.rinkeby,
  compRate: "176000000000000000",
  accThatGetsAllInitialBLO: "0x966da064E49F63D84d636D5a694038D831c75051",
  timelockPendingAdminETA: 1612825772
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
