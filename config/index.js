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
  accThatGetsAllInitialBLO: "0x9e3C40045A3503b33BfEdAEA0BF6981120E8c753"
};

const mainnet_fork = {
  anchorPeriod: 1800,
  closeFactorMantissa: '900000000000000000',
  maxAssets: '30',
  liquidationIncentiveMantissa: '1080000000000000000',
  // comptroller config END
  modelsConfig: modelsConfig.mainnet,
  marketsConfig: marketsConfig.mainnet,
  accThatGetsAllInitialBLO: "0x9e3C40045A3503b33BfEdAEA0BF6981120E8c753"
};

const rinkeby = {
  anchorPeriod: 1800,
  closeFactorMantissa: '900000000000000000',
  maxAssets: '50',
  liquidationIncentiveMantissa: '1250000000000000000',
  modelsConfig: modelsConfig.rinkeby,
  marketsConfig: marketsConfig.rinkeby,
  accThatGetsAllInitialBLO: "0x9e3C40045A3503b33BfEdAEA0BF6981120E8c753"
};

const localhost = {
  anchorPeriod: 1800,
  closeFactorMantissa: '900000000000000000',
  maxAssets: '50',
  liquidationIncentiveMantissa: '1250000000000000000',
  modelsConfig: modelsConfig.mainnet,
  marketsConfig: marketsConfig.mainnet,
  accThatGetsAllInitialBLO: "0x9e3C40045A3503b33BfEdAEA0BF6981120E8c753"
};

const hardhat = mainnet;

module.exports = {
  mainnet,
  mainnet_fork,
  rinkeby,
  localhost,
  hardhat
};
