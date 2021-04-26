/* global */

const ethers = require('ethers');
const marketsConfig = require('./marketsConfig');
const modelsConfig = require('./modelsConfig');
const tokenDistribution = require('./tokenDistribution');

const mainnet = {
  nativeTokenSymbol: "ETH",
  anchorPeriod: 900, // 15 min
  closeFactorMantissa: '900000000000000000',
  maxAssets: '50',
  liquidationIncentiveMantissa: '1250000000000000000',
  modelsConfig: modelsConfig.mainnet,
  marketsConfig: marketsConfig.mainnet,
  tokenDistribution: tokenDistribution.mainnet,
  compRate: "176000000000000000",
  timelockPendingAdminETA: 1612825772,
  timelockDelay: 60 * 60 * 24 * 3 // 3 days
};

const rinkeby = {
  nativeTokenSymbol: "ETH",
  anchorPeriod: 900, // 15 min
  closeFactorMantissa: '900000000000000000',
  maxAssets: '50',
  liquidationIncentiveMantissa: '1250000000000000000',
  modelsConfig: modelsConfig.rinkeby,
  marketsConfig: marketsConfig.rinkeby,
  tokenDistribution: tokenDistribution.rinkeby,
  compRate: "176000000000000000",
  timelockPendingAdminETA: 1619719099,
  timelockDelay: 60 * 60 * 24 * 2
};

const mainnet_fork = mainnet;
const localhost = mainnet;
const hardhat = {
  ...mainnet,
  // this value will cause unit tests fail if too low, which will eventually happen
  // since mainnet's value is static so we override this
  timelockPendingAdminETA: 1992825772,
};

const matic = {
  nativeTokenSymbol: "MATIC",
  anchorPeriod: 900, // 15 min
  closeFactorMantissa: '900000000000000000',
  maxAssets: '50',
  liquidationIncentiveMantissa: '1250000000000000000',
  modelsConfig: modelsConfig.matic,
  marketsConfig: marketsConfig.matic,
  compRate: "176000000000000000",
  timelockPendingAdminETA: 1612825772,
  timelockDelay: 60 * 60 * 24 * 3 // 3 days
}

module.exports = {
  mainnet,
  mainnet_fork,
  rinkeby,
  localhost,
  hardhat,
  matic
};
