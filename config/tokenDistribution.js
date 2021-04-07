const ethers = require('ethers');
const tokens = require('./tokenAddresses.js');

const mainnetConfig = {
  mbBased: {
    stakingTokenAddress: '0x26cf82e4ae43d31ea51e72b663d26e26a75af729',
    duration: 120, // 2 minutes
    rewardAmount: '35000000' + '000000000000000000', // 35 mil tokens
    startTime: 	1618617600, // From 2021-04-17:00:00:00 UTC
  },
  Comp: {
    stakingTokenAddress: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    duration: 120, // 2 minutes
    rewardAmount: '12000000' + '000000000000000000', // 12 mil tokens
    startTime: 	1618617600, // From 2021-04-17:00:00:00 UTC
  }
}

const rinkebyConfig = mainnetConfig;

module.exports = {
  mainnet: mainnetConfig,
  rinkeby: rinkebyConfig,
};
