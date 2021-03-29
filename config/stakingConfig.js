const ethers = require('ethers');
const tokens = require('./tokenAddresses.js');

const mainnetConfig = {
  
}

const rinkebyConfig = {
  BLOETHPool: {
    name: 'BLOETHPool',
    stakingTokenAddress: ethers.constants.AddressZero,
    rewardTokenAddress: '0x34dc0fb7ee9098a7685d2ff7077bcf5c1e1e0658', // Set here or get BLO address from deployed contracts
    duration: 3 * 30 * 24 * 3600, // For 3 months
    rewardAmount: '1000000' + '000000000000000000', // One million tokens
    startTime: 	1617026400, // From 2021-03-31:00:00:00 UTC
    fairDistribution: false,
  },
  BLOWBTCPool: {
    name: 'BLOWBTCPool',
    stakingTokenAddress: '0xb480C498F33a664DD43Ffab82D9c49B073Db8b2c',
    rewardTokenAddress: '0x34dc0fb7ee9098a7685d2ff7077bcf5c1e1e0658', // Set custom reward token address or get BLO address from deployed contracts
    duration: 3 * 30 * 24 * 3600, // For 3 months
    rewardAmount: '1000000' + '000000000000000000', // One million tokens
    startTime: 	1617026400, // From 2021-03-31:00:00:00 UTC
    fairDistribution: false,
  },
};

module.exports = {
  mainnet: mainnetConfig,
  rinkeby: rinkebyConfig,
};
