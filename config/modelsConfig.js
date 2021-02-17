/* global */
const ethers = require('ethers');

const DAIModel = {
  jumpMultiplierPerYear: '1090000000000000000',
  kink_: '800000000000000000',
  pot_: '0x197e90f9fad81970ba7976f33cbd77088e5d7cf7',
  jug_: '0x19c0976f590d67707e62397c87829d896dc0f1f1',
  address: '0x93675D64b8353151BD02edd24d358234aE9e50FD'
}

const HQLAModel = {
  baseRatePerYear: '1000000000000000',
  multiplierPerYear: '30000000000000000',
  jumpMultiplierPerYear: '10000000000000000000',
  kink_: '750000000000000000',
  address: '0x226ca583E2ff3A635d437D8fCede8d1073e885f4'
}

const OADefaultModel = {
  baseRatePerYear: '60000000000000000',
  multiplierPerYear: '200000000000000000',
  jumpMultiplierPerYear: '30000000000000000000',
  kink_: '750000000000000000',
  address: '0x608D42E146d81eA4A7bc2883aCbb50161ba36bf1'
}

const OAHighJumpModel = {
  baseRatePerYear: '60000000000000000',
  multiplierPerYear: '200000000000000000',
  jumpMultiplierPerYear: '100000000000000000000',
  kink_: '750000000000000000',
  address: '0xE324D8144A123F7B776bA04a668495FBECc1ACAC'
}

module.exports = [{DAIModel}, {HQLAModel}, {OADefaultModel}, {OAHighJumpModel}];
