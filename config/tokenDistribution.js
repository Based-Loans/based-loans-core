const ethers = require('ethers');
const tokens = require('./tokenAddresses.js');

const mainnetConfig = {
  mbBased: {
    stakingTokenAddress: '0x26cF82e4aE43D31eA51e72B663d26e26a75AF729',
    duration: 420,
    rewardAmount: '35000000' + '000000000000000000', // 35 mil tokens
    startTime: 	1618935600, // Tuesday, April 20, 2021 4:20:00 PM
  },
  comp: {
    stakingTokenAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    duration: 420,
    rewardAmount: '12000000' + '000000000000000000', // 12 mil tokens
    startTime: 	1618935600, // Tuesday, April 20, 2021 4:20:00 PM
  }
}

const rinkebyConfig = {
  wbtc: {
    stakingTokenAddress: '0xb480C498F33a664DD43Ffab82D9c49B073Db8b2c',
    duration: 360000,
    rewardAmount: '35000000' + '000000000000000000', // 35 mil tokens
    startTime: 	Math.floor(Date.now() / 1000) + 300,
  },
  usdc: {
    stakingTokenAddress: '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
    duration: 360000,
    rewardAmount: '12000000' + '000000000000000000', // 12 mil tokens
    startTime: 	Math.floor(Date.now() / 1000) + 600,
  }
};

module.exports = {
  mainnet: mainnetConfig,
  rinkeby: rinkebyConfig,
};
