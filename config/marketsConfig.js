/* global */
const ethers = require('ethers');
const tokens = require('./tokenAddresses.js');

// High quality markets
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
  isComped: false
}

const bUSDC = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.USDC.address,
    symbolHash: tokens.USDC.symbolHash,
    baseUnit: (10**tokens.USDC.decimals).toString(),
    priceSource: 1,
    fixedPrice: '1000000000000000000',
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
  isComped: false
}

const bUSDT = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.USDT.address,
    symbolHash: tokens.USDT.symbolHash,
    baseUnit: (10**tokens.USDT.decimals).toString(),
    priceSource: 1,
    fixedPrice: '1000000000000000000',
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000',
  name: 'Based Loans ' + tokens.USDT.symbol,
  symbol: 'b' + tokens.USDT.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0',
  model: 'HQLAModel',
  isComped: false
}

const bWBTC = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.WBTC.address,
    symbolHash: tokens.WBTC.symbolHash,
    baseUnit: (10**tokens.WBTC.decimals).toString(),
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
  isComped: false
}

const bDPI = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.DPI.address,
    symbolHash: tokens.DPI.symbolHash,
    baseUnit: (10**tokens.DPI.decimals).toString(),
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x4d5ef58aAc27d99935E5b6B4A6778ff292059991',
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
  isComped: false
}


// Other markets
const bSHIBA = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.SHIBA.address,
    symbolHash: tokens.SHIBA.symbolHash,
    baseUnit: (10**tokens.SHIBA.decimals).toString(),
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x811beed0119b4afce20d2583eb608c6f7af1954f',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.SHIBA.symbol,
  symbol: 'b' + tokens.SHIBA.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '609867273746' + (10**tokens.SHIBA.decimals).toString(), // 100% of uniswap liquidity
  model: 'OADefaultModel',
  isComped: false
}

const bKISHU = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.KISHU.address,
    symbolHash: tokens.KISHU.symbolHash,
    baseUnit: (10**tokens.KISHU.decimals).toString(),
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0xF82d8Ec196Fb0D56c6B82a8B1870F09502A49F88',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000',
  name: 'Based Loans ' + tokens.KISHU.symbol,
  symbol: 'b' + tokens.KISHU.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '486813673731292' + (10**tokens.KISHU.decimals).toString(), // 100% of uniswap liquidity
  model: 'OADefaultModel',
  isComped: false
}

const bELON = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.ELON.address,
    symbolHash: tokens.ELON.symbolHash,
    baseUnit: (10**tokens.ELON.decimals).toString(),
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x7B73644935b8e68019aC6356c40661E1bc315860',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.ELON.symbol,
  symbol: 'b' + tokens.ELON.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '26600487382023' + (10**tokens.ELON.decimals).toString(), // 100% of uniswap liquidity
  model: 'OADefaultModel',
  isComped: false
}

const bAKITA = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.AKITA.address,
    symbolHash: tokens.AKITA.symbolHash,
    baseUnit: (10**tokens.AKITA.decimals).toString(),
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0xDA3A20aaD0C34fA742BD9813d45Bbf67c787aE0b',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.AKITA.symbol,
  symbol: 'b' + tokens.AKITA.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '955320107863' + (10**tokens.ELON.decimals).toString(), // 100% of uniswap liquidity
  model: 'OADefaultModel',
  isComped: false
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
  model: 'OADefaultModel',
  isComped: false
}


// ####### RINKEBY markets #######
const bETH__rinkeby = {
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
  isComped: false
}

const bBLORinkeby = {
  ...bBLO,
  weth: '0xc778417e063141139fce010982780140aa0cd5ab'
}

const bUSDC__rinkeby = {
  tokenConfig: {
    cToken: '#',
    underlying: "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926",
    symbolHash: tokens.USDC.symbolHash,
    baseUnit: (10**tokens.USDC.decimals).toString(),
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
  isComped: false
}

const bTNTRinkeby = {
  tokenConfig: {
    cToken: '#',
    underlying: "0x8eca7c70f4ceae3ea6fde71c0f0bc616e9750d0a",
    symbolHash: "0x2656f58b0a73a32f9b4ad1c8eec5812754603b0309487bb4d296a7758f796e1c",
    baseUnit: (10**18).toString(),
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x9aafe005b26139edde8666dd63b50036b273bc42',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans TNT',
  symbol: 'bTNT',
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '955320107863' + (10**tokens.ELON.decimals).toString(), // 100% of uniswap liquidity
  model: 'OADefaultModel',
  isComped: false
}

const bWBTCRinkeby = {
  tokenConfig: {
    cToken: '#',
    underlying: "0xb480C498F33a664DD43Ffab82D9c49B073Db8b2c",
    symbolHash: tokens.WBTC.symbolHash,
    baseUnit: (10**tokens.WBTC.decimals).toString(),
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
  isComped: false
}
// ####### RINKEBY markets END #######

// ####### MATIC markets #######

const bMatic__matic = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.MATIC__matic.address,
    symbolHash: tokens.MATIC__matic.symbolHash,
    baseUnit: (10**tokens.MATIC__matic.decimals).toString(),
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.MATIC__matic.symbol,
  symbol: 'b' + tokens.MATIC__matic.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0',
  model: 'HQLAModel',
  isComped: false
}

const bUSDC__matic = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.USDC__matic.address,
    symbolHash: tokens.USDC__matic.symbolHash,
    baseUnit: (10**tokens.USDC__matic.decimals).toString(),
    priceSource: 1,
    fixedPrice: 1000000,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000',
  name: 'Based Loans ' + tokens.USDC__matic.symbol,
  symbol: 'b' + tokens.USDC__matic.symbol,
  decimals: '8',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0',
  model: 'HQLAModel',
  isComped: false
}

// ####### MATIC markets END #######

module.exports = {
  "mainnet": {bETH, bUSDC, bUSDT, bWBTC, bDPI, bSHIBA, bKISHU, bELON, bAKITA, bBLO},
  "matic": {"bMatic": bMatic__matic, "bUSDC": bUSDC__matic},
  "rinkeby": {"bETH": bETH__rinkeby, "bUSDC": bUSDC__rinkeby, bUSDT, "bWBTC": bWBTCRinkeby, bBLO: bBLORinkeby, bTNTRinkeby: bTNTRinkeby}
};
