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
  decimals: '18',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0'
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
  decimals: '18',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0'
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
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans BLO',
  symbol: 'bBLO',
  decimals: '18',
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0',
  weth: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
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
  decimals: tokens.USDC.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0'
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
  decimals: tokens.USDC.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0'
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
  decimals: tokens.USDT.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0'
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
  decimals: tokens.DAI.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0'
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
  decimals: tokens.WBTC.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0'
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
  decimals: tokens.WBTC.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0'
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
  decimals: tokens.DPI.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '400000000000000000',
  borrowCaps: '0'
}

const bCORE = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.CORE.address,
    symbolHash: tokens.CORE.symbolHash,
    baseUnit: 10**tokens.CORE.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.CORE.symbol,
  symbol: 'b' + tokens.CORE.symbol,
  decimals: tokens.CORE.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

const bFARM = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.FARM.address,
    symbolHash: tokens.FARM.symbolHash,
    baseUnit: 10**tokens.FARM.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.FARM.symbol,
  symbol: 'b' + tokens.FARM.symbol,
  decimals: tokens.FARM.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

const bESD = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.ESD.address,
    symbolHash: tokens.ESD.symbolHash,
    baseUnit: (10**tokens.ESD.decimals).toString(),
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x4acDB58fD79556cD276a08ec2e599d48A1ac6290',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.ESD.symbol,
  symbol: 'b' + tokens.ESD.symbol,
  decimals: tokens.ESD.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

const bESDRinkeby = {
  tokenConfig: {
    cToken: '#',
    underlying: '0x8eca7c70f4CEAE3eA6fDe71c0F0bc616e9750d0a',
    symbolHash: tokens.ESD.symbolHash,
    baseUnit: (10**tokens.ESD.decimals).toString(),
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x9aAFE005B26139EddE8666Dd63b50036b273Bc42',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.ESD.symbol,
  symbol: 'b' + tokens.ESD.symbol,
  decimals: tokens.ESD.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

const bRSR = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.RSR.address,
    symbolHash: tokens.RSR.symbolHash,
    baseUnit: 10**tokens.RSR.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.RSR.symbol,
  symbol: 'b' + tokens.RSR.symbol,
  decimals: tokens.RSR.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

const bPICKLE = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.PICKLE.address,
    symbolHash: tokens.PICKLE.symbolHash,
    baseUnit: 10**tokens.PICKLE.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.PICKLE.symbol,
  symbol: 'b' + tokens.PICKLE.symbol,
  decimals: tokens.PICKLE.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

const bHEX = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.HEX.address,
    symbolHash: tokens.HEX.symbolHash,
    baseUnit: 10**tokens.HEX.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.HEX.symbol,
  symbol: 'b' + tokens.HEX.symbol,
  decimals: tokens.HEX.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

const bCVP = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.CVP.address,
    symbolHash: tokens.CVP.symbolHash,
    baseUnit: 10**tokens.CVP.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.CVP.symbol,
  symbol: 'b' + tokens.CVP.symbol,
  decimals: tokens.CVP.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

const bAUDIO = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.AUDIO.address,
    symbolHash: tokens.AUDIO.symbolHash,
    baseUnit: 10**tokens.AUDIO.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.AUDIO.symbol,
  symbol: 'b' + tokens.AUDIO.symbol,
  decimals: tokens.AUDIO.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

const bHEGIC = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.HEGIC.address,
    symbolHash: tokens.HEGIC.symbolHash,
    baseUnit: 10**tokens.HEGIC.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.HEGIC.symbol,
  symbol: 'b' + tokens.HEGIC.symbol,
  decimals: tokens.HEGIC.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

const bDHT = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.DHT.address,
    symbolHash: tokens.DHT.symbolHash,
    baseUnit: 10**tokens.DHT.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.DHT.symbol,
  symbol: 'b' + tokens.DHT.symbol,
  decimals: tokens.DHT.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

const bBAC = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.BAC.address,
    symbolHash: tokens.BAC.symbolHash,
    baseUnit: 10**tokens.BAC.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.BAC.symbol,
  symbol: 'b' + tokens.BAC.symbol,
  decimals: tokens.BAC.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

const bBAS = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.BAS.address,
    symbolHash: tokens.BAS.symbolHash,
    baseUnit: 10**tokens.BAS.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.BAS.symbol,
  symbol: 'b' + tokens.BAS.symbol,
  decimals: tokens.BAS.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

const bFRAX = {
  tokenConfig: {
    cToken: '#',
    underlying: tokens.FRAX.address,
    symbolHash: tokens.FRAX.symbolHash,
    baseUnit: 10**tokens.FRAX.decimals,
    priceSource: 2,
    fixedPrice: 0,
    uniswapMarket: '0x0000000000000000000000000000000000000000',
    isUniswapReversed: false
  },
  initialExchangeRateMantissa: '200000000000000000000000000',
  name: 'Based Loans ' + tokens.FRAX.symbol,
  symbol: 'b' + tokens.FRAX.symbol,
  decimals: tokens.FRAX.decimals,
  reserveFactorMantissa: '0',
  collateralFactorMantissa: '0',
  borrowCaps: '0'
}

module.exports = {
  "mainnet": {bETH, bUSDC, bUSDT, bDAI, bWBTC, bBLO, bDPI, bCORE, bFARM, bESD, bRSR, bPICKLE, bHEX, bCVP, bAUDIO, bHEGIC, bDHT, bBAC, bBAS, bFRAX},
  "rinkeby": {"bETH": bETHRinkeby, "bUSDC": bUSDCRinkeby, bUSDT, bDAI, "bWBTC": bWBTCRinkeby, bBLO: bBLORinkeby, bDPI, bCORE, bFARM, "bESD": bESDRinkeby, bRSR, bPICKLE, bHEX, bCVP, bAUDIO, bHEGIC, bDHT, bBAC, bBAS, bFRAX}
};
