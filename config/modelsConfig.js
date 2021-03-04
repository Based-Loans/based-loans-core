/* global */
const ethers = require('ethers');

const DAIModel = {
  jumpMultiplierPerYear: '1090000000000000000',
  kink_: '800000000000000000',
  pot_: '0x197e90f9fad81970ba7976f33cbd77088e5d7cf7',
  jug_: '0x19c0976f590d67707e62397c87829d896dc0f1f1'
}

const DAIModelRinkeby = {
  jumpMultiplierPerYear: '1090000000000000000',
  kink_: '800000000000000000',
  pot_: '0x867E3054af4d30fCCF0fCf3B6e855B49EF7e02Ed',
  jug_: '0xF6ecaC073C95e9170af878Dfd2934e31c6E25D85'
}

const HQLAModel = {
  baseRatePerYear: '1000000000000000',
  multiplierPerYear: '30000000000000000',
  jumpMultiplierPerYear: '10000000000000000000',
  kink_: '750000000000000000'
}

const OADefaultModel = {
  baseRatePerYear: '60000000000000000',
  multiplierPerYear: '200000000000000000',
  jumpMultiplierPerYear: '30000000000000000000',
  kink_: '750000000000000000'
}

const OAHighJumpModel = {
  baseRatePerYear: '60000000000000000',
  multiplierPerYear: '200000000000000000',
  jumpMultiplierPerYear: '100000000000000000000',
  kink_: '750000000000000000'
}

module.exports = {
  "mainnet": [{DAIModel}, {HQLAModel}, {OADefaultModel}, {OAHighJumpModel}],
  "rinkeby": [{"DAIModel": DAIModelRinkeby}, {HQLAModel}, {OADefaultModel}, {OAHighJumpModel}]
};
