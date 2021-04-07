const ethers = require('ethers');
const tokens = require('./tokenAddresses.js');

const mainnetConfig = {
  mbBased: {
    stakingTokenAddress: '0x26cF82e4aE43D31eA51e72B663d26e26a75AF729',
    duration: 120, // 2 minutes
    rewardAmount: '35000000' + '000000000000000000', // 35 mil tokens
    startTime: 	1618617600, // From 2021-04-17:00:00:00 UTC
  },
  comp: {
    stakingTokenAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    duration: 120, // 2 minutes
    rewardAmount: '12000000' + '000000000000000000', // 12 mil tokens
    startTime: 	1618617600, // From 2021-04-17:00:00:00 UTC
  }
}

const rinkebyConfig = {
  wbtc: {
    stakingTokenAddress: '0xb480C498F33a664DD43Ffab82D9c49B073Db8b2c',
    duration: 120, // 2 minutes
    rewardAmount: '35000000' + '000000000000000000', // 35 mil tokens
    startTime: 	1618617600, // From 2021-04-17:00:00:00 UTC
  },
  usdc: {
    stakingTokenAddress: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
    duration: 120, // 2 minutes
    rewardAmount: '12000000' + '000000000000000000', // 12 mil tokens
    startTime: 	1618617600, // From 2021-04-17:00:00:00 UTC
  }
};

module.exports = {
  mainnet: mainnetConfig,
  rinkeby: rinkebyConfig,
};
