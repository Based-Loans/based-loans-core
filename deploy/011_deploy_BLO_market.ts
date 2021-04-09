import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

import { FACTORY_ADDRESS, INIT_CODE_HASH } from '@uniswap/sdk'
import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'

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

  console.log('### WARNING ###');
  console.log('>>> create a uniswap pair for BLO<>ETH manually <<<');
  console.log('>>> you have 10 sec to cancel this script if you did NOT create a pair <<<');
  console.log('### WARNING ###');

  await new Promise(r => setTimeout(r, 10000));

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
