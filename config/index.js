/* global */

const ethers = require('ethers');
const marketsConfig = require('./marketsConfig');
const modelsConfig = require('./modelsConfig');

const MAINNET = {
  anchorPeriod: 1800,
  closeFactorMantissa: '900000000000000000',
  maxAssets: '50',
  liquidationIncentiveMantissa: '1250000000000000000',
  modelsConfig: modelsConfig,
  marketsConfig: marketsConfig,
  accThatGetsAllInitialBLO: "0x9e3C40045A3503b33BfEdAEA0BF6981120E8c753"
};

const MAINNET_FORK = {
  anchorPeriod: 1800,
  closeFactorMantissa: '900000000000000000',
  maxAssets: '30',
  liquidationIncentiveMantissa: '1080000000000000000',
  // comptroller config END
  modelsConfig: modelsConfig,
  marketsConfig: marketsConfig,
  accThatGetsAllInitialBLO: "0x9e3C40045A3503b33BfEdAEA0BF6981120E8c753"
};

const RINKEBY = {

};

const LOCAL = {
  anchorPeriod: 1800,
  closeFactorMantissa: '900000000000000000',
  maxAssets: '30',
  liquidationIncentiveMantissa: '1080000000000000000',
  // comptroller config END
  modelsConfig: modelsConfig,
  marketsConfig: marketsConfig,
  accThatGetsAllInitialBLO: "0x9e3C40045A3503b33BfEdAEA0BF6981120E8c753"
};

module.exports = {
  MAINNET,
  MAINNET_FORK,
  RINKEBY,
  LOCAL
};
