/* global */

const ethers = require('ethers');
const marketsConfig = require('./marketsConfig');
const modelsConfig = require('./modelsConfig');

const mainnet = {
  anchorPeriod: 1800,
  closeFactorMantissa: '900000000000000000',
  maxAssets: '50',
  liquidationIncentiveMantissa: '1250000000000000000',
  modelsConfig: modelsConfig.mainnet,
  marketsConfig: marketsConfig.mainnet,
  accThatGetsAllInitialBLO: "0x966da064E49F63D84d636D5a694038D831c75051"
};

const rinkeby = {
  anchorPeriod: 1800,
  closeFactorMantissa: '900000000000000000',
  maxAssets: '50',
  liquidationIncentiveMantissa: '1250000000000000000',
  modelsConfig: modelsConfig.rinkeby,
  marketsConfig: marketsConfig.rinkeby,
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
