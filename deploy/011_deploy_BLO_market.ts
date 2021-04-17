import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

import { FACTORY_ADDRESS, INIT_CODE_HASH, MINIMUM_LIQUIDITY } from '@uniswap/sdk'
import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'
import UniswapV2Factory from '../test/abi/UniswapV2Factory.json';
import UniswapV2Router02 from '../test/abi/UniswapV2Router02.json';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const blo = await deployments.get('Blo');
  const ethers = hre.ethers;
  const config = CONFIG[hre.network.name];

  const comptroller = new hre.ethers.Contract(
    (await deployments.get('Unitroller')).address,
    (await deployments.get('Comptroller')).abi,
    await hre.ethers.provider.getSigner(deployer)
  );

  let uniswapFactory = new ethers.Contract(
    FACTORY_ADDRESS,
    UniswapV2Factory,
    await ethers.provider.getSigner(deployer)
  );

  let WETH;
  if (hre.network.name == 'rinkeby') {
    WETH = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
  } else {
    WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  }

  const bloAddress = (await deployments.get('Blo')).address;
  const pair = await uniswapFactory.getPair(WETH, bloAddress);
  if (pair == ethers.constants.AddressZero) {
    console.log(`executing uniswapFactory.createPair (pair[]: ${WETH}, ${bloAddress})`)
    let tx = await uniswapFactory.createPair(WETH, bloAddress);
    await tx.wait();

    const uniswapRouter = new ethers.Contract(
      '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      UniswapV2Router02,
      await ethers.provider.getSigner(deployer)
    );

    await execute(
      'Blo',
      {from: deployer, log: true},
      'approve',
      uniswapRouter.address,
      ethers.constants.WeiPerEther
    );

    const ethAmount = ethers.constants.WeiPerEther.div(1000);
    console.log(`executing uniswapRouter.addLiquidityETH (args: ${bloAddress}, ${ethers.constants.WeiPerEther}, ${ethers.constants.WeiPerEther}, ${ethAmount}, ${deployer}, 1912825772)`)
    tx = await uniswapRouter.addLiquidityETH(
      bloAddress,
      ethers.constants.WeiPerEther,
      ethers.constants.WeiPerEther,
      ethAmount,
      deployer,
      1912825772,
      {value: ethAmount}
    );
    await tx.wait();
  } else {
    console.log(`skipping uniswapFactory.createPair (pair exists: ${pair})`)
  }

  // Setup BLO market
  const OADefaultModel = await deployments.get('OADefaultModel');
  let bBloConfig = config.marketsConfig.bBLO;
  const cErc20Immutable = await deploy("CErc20Immutable." + bBloConfig.symbol, {
    contract: "CErc20Immutable",
    from: deployer,
    log: true,
    args: [
      blo.address,
      comptroller.address,
      OADefaultModel.address,
      bBloConfig.initialExchangeRateMantissa,
      bBloConfig.name,
      bBloConfig.symbol,
      bBloConfig.decimals,
      deployer
    ]
  });

  // Add BLO to the oracle
  bBloConfig.tokenConfig.cToken = cErc20Immutable.address;
  bBloConfig.tokenConfig.underlying = blo.address;

  // get uniswap market address - pair does not exist yet
  let tok0 = ethers.BigNumber.from(blo.address);
  let tok1 = ethers.BigNumber.from(bBloConfig.weth);

  let token0, token1;
  if(tok0.lt(tok1)) {
    token0 = blo.address;
    token1 = bBloConfig.weth;
  } else {
    token0 = bBloConfig.weth;
    token1 = blo.address;
    bBloConfig.tokenConfig.isUniswapReversed = true;
  }

  bBloConfig.tokenConfig.uniswapMarket = getCreate2Address(
    FACTORY_ADDRESS,
    keccak256(['bytes'], [pack(['address', 'address'], [token0, token1])]),
    INIT_CODE_HASH
  )
  const observation = await read('UniswapAnchoredView', 'newObservations', bBloConfig.tokenConfig.symbolHash);
  if(observation.timestamp.toString() == '0') {
    await execute(
      'UniswapAnchoredView',
      {from: deployer, log: true, gasLimit: 600000},
      'addTokens',
      [bBloConfig.tokenConfig]
    );
  } else {
    console.log(`skipping UniswapAnchoredView.addTokens (newObservations[symbolHash]: ${observation.timestamp.toString()})`)
  }

  // Configure market
  bBloConfig.name = 'CErc20Immutable.' + bBloConfig.symbol;
  if((await read(bBloConfig.name, 'reserveFactorMantissa')).toString() != bBloConfig.reserveFactorMantissa) {
    await execute(
      bBloConfig.name,
      {from: deployer, log: true},
      '_setReserveFactor',
      bBloConfig.reserveFactorMantissa
    );
  } else {
    console.log(`skipping ${bBloConfig.name}._setReserveFactor (reserveFactorMantissa (${bBloConfig.symbol}): ${(await read(bBloConfig.name, 'reserveFactorMantissa')).toString()})`)
  }

  if(!(await comptroller.markets(bBloConfig.tokenConfig.cToken)).isListed) {
    let tx = await comptroller._supportMarket(bBloConfig.tokenConfig.cToken);
    tx = await tx.wait()
    console.log(`executing Comptroller._supportMarket (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._supportMarket (isListed (${bBloConfig.symbol}): ${(await comptroller.markets(bBloConfig.tokenConfig.cToken)).isListed})`)
  }

  if(
    (await comptroller.markets(bBloConfig.tokenConfig.cToken)).collateralFactorMantissa.toString()
    != bBloConfig.collateralFactorMantissa
  ) {
    let tx = await comptroller._setCollateralFactor(bBloConfig.tokenConfig.cToken, bBloConfig.collateralFactorMantissa, {gasLimit: 2000000});
    tx = await tx.wait()
    console.log(`executing Comptroller._setCollateralFactor (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setCollateralFactor (collateralFactorMantissa (${bBloConfig.symbol}): ${(await comptroller.markets(bBloConfig.tokenConfig.cToken)).collateralFactorMantissa.toString()})`)
  }

  if(
    (await comptroller.borrowCaps(bBloConfig.tokenConfig.cToken)).toString()
    != bBloConfig.borrowCaps
  ) {
    let tx = await comptroller._setMarketBorrowCaps(bBloConfig.borrowCaps);
    tx = await tx.wait()
    console.log(tx.events[0].args, `executing Comptroller._setMarketBorrowCaps (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setMarketBorrowCaps (borrowCaps (${bBloConfig.symbol}): ${(await comptroller.borrowCaps(bBloConfig.tokenConfig.cToken)).toString()})`)
  }
};
export default func;
func.tags = ['blo_market']
func.dependencies = ['app', 'blo']
