/* global */
const ethers = require('ethers');
const tokens = require('./tokenAddresses.js');

const bETH = {
  tokenConfig: {
    cToken: '#',
    underlying: ethers.constants.AddressZero,
    symbolHash: '0xaaaebeba3810b1e6b70781f14b2d72c1cb89c0b2b320c43bb67ff79f562f5ff4',
    baseUnit: '1000000000000000000',
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
    isUniswapReversed: true
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ETH',
  symbol: 'bETH',
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0',
  model: 'HQLAModel',
  isComped: true
}

const bETHRinkeby = {
  tokenConfig: {
    cToken: '#',
    underlying: ethers.constants.AddressZero,
    symbolHash: '0xaaaebeba3810b1e6b70781f14b2d72c1cb89c0b2b320c43bb67ff79f562f5ff4',
    baseUnit: '1000000000000000000',
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0xB1bC33810F9e6E8D417925236991Fcc5012AaaE8',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ETH',
  symbol: 'bETH',
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0',
  model: 'HQLAModel',
  isComped: true
}

const bBLO = {
  tokenConfig: {
    cToken: '#',
    underlying: "#",
    symbolHash: '0x009696ff259d96a610b5ca16016fbc7bd6940a633aab23ae0b36ee6a7ad4a98b',
    baseUnit: '1000000000000000000',
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '#',
    isUniswapReversed: false
  },
  weth: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans BLO',
  symbol: 'bBLO',
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0',
  model: 'HQLAModel',
  isComped: true
}

const bBLORinkeby = {
  ...bBLO,
  weth: '0xc778417e063141139fce010982780140aa0cd5ab'
}

const bUSDC = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.USDC.address,
    symbolHash: tokens.USDC.symbolHash,
    baseUnit: 10**tokens.USDC.decimals,
    priceSource: 1,
    fixedPrice: 1000000,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000',
  name: 'Based Loans ' + tokens.USDC.symbol,
  symbol: 'b' + tokens.USDC.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0',
  model: 'HQLAModel',
  isComped: true
}

const bUSDCRinkeby = {
  tokenConfig: {
    cToken: '#',
    underlying: "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926",
    symbolHash: tokens.USDC.symbolHash,
    baseUnit: 10**tokens.USDC.decimals,
    priceSource: 1,
    fixedPrice: 1000000,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000',
  name: 'Based Loans ' + tokens.USDC.symbol,
  symbol: 'b' + tokens.USDC.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0',
  model: 'HQLAModel',
  isComped: true
}

const bUSDT = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.USDT.address,
    symbolHash: tokens.USDT.symbolHash,
    baseUnit: 10**tokens.USDT.decimals,
    priceSource: 1,
    fixedPrice: 1000000,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.USDT.symbol,
  symbol: 'b' + tokens.USDT.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0',
  model: 'HQLAModel',
  isComped: true
}

const bDAI = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.DAI.address,
    symbolHash: tokens.DAI.symbolHash,
    baseUnit: 10**tokens.DAI.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.DAI.symbol,
  symbol: 'b' + tokens.DAI.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0',
  model: 'HQLAModel',
  isComped: true
}

const bWBTC = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.WBTC.address,
    symbolHash: tokens.WBTC.symbolHash,
    baseUnit: 10**tokens.WBTC.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0xBb2b8038a1640196FbE3e38816F3e67Cba72D940',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '20000000000000000',
  name: 'Based Loans ' + tokens.WBTC.symbol,
  symbol: 'b' + tokens.WBTC.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0',
  model: 'HQLAModel',
  isComped: true
}

const bWBTCRinkeby = {
  tokenConfig: {
    cToken: '#',
    underlying: "0xb480C498F33a664DD43Ffab82D9c49B073Db8b2c",
    symbolHash: tokens.WBTC.symbolHash,
    baseUnit: 10**tokens.WBTC.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x12bfA2C92F0bf1A67802E13BbC57DE89DE96b893',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '20000000000000000',
  name: 'Based Loans ' + tokens.WBTC.symbol,
  symbol: 'b' + tokens.WBTC.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0',
  model: 'HQLAModel',
  isComped: true
}

const bDPI = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.DPI.address,
    symbolHash: tokens.DPI.symbolHash,
    baseUnit: 10**tokens.DPI.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.DPI.symbol,
  symbol: 'b' + tokens.DPI.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0',
  model: 'HQLAModel',
  isComped: true
}

module.exports = {
  "mainnet": {bETH, bUSDC, bUSDT, bDAI, bWBTC, bBLO, bDPI},
  "rinkeby": {"bETH": bETHRinkeby, "bUSDC": bUSDCRinkeby, bUSDT, bDAI, "bWBTC": bWBTCRinkeby, bBLO: bBLORinkeby}
};
