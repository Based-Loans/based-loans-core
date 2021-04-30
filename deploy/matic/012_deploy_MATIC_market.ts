import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const config = CONFIG[hre.network.name];
  const HQLAModel = await deployments.get('HQLAModel');

  const comptroller = new hre.ethers.Contract(
    (await deployments.get('Unitroller')).address,
    (await deployments.get('Comptroller')).abi,
    await hre.ethers.provider.getSigner(deployer)
  );

  let bMaticConfig = config.marketsConfig.bMatic;
  bMaticConfig.name = 'CMatic';

  const args = [
    comptroller.address,
    HQLAModel.address,
    bMaticConfig.initialExchangeRateMantissa,
    bMaticConfig.name,
    bMaticConfig.symbol,
    bMaticConfig.decimals,
    deployer
  ]

  const bMatic = await deploy(bMaticConfig.name, {
    contract: "CEther",
    from: deployer,
    log: true,
    args: args
  });
  bMaticConfig.cToken = bMatic.address;

  let tokenConfig = bMaticConfig.tokenConfig;
  tokenConfig.cToken = bMaticConfig.cToken;

  const i = await read('UniswapAnchoredView', 'cTokenIndex', bMaticConfig.cToken);
  const token = await read('UniswapAnchoredView', 'tokens', i);
  if (token.cToken != bMaticConfig.cToken) {
    await execute(
      'UniswapAnchoredView',
      {from: deployer, log: true, gasLimit: 500000},
      'addTokens',
      [tokenConfig]
    );
  }

  if((await read(bMaticConfig.name, 'reserveFactorMantissa')).toString() != bMaticConfig.reserveFactorMantissa) {
    await execute(
      bMaticConfig.name,
      {from: deployer, log: true},
      '_setReserveFactor',
      bMaticConfig.reserveFactorMantissa
    );
  } else {
    console.log(`skipping ${bMaticConfig.name}._setReserveFactor (reserveFactorMantissa (${bMaticConfig.symbol}): ${(await read(bMaticConfig.name, 'reserveFactorMantissa')).toString()})`)
  }

  if(!(await comptroller.markets(bMaticConfig.cToken)).isListed) {
    let tx = await comptroller._supportMarket(bMaticConfig.cToken);
    tx = await tx.wait()
    console.log(`executing Comptroller._supportMarket (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(
      `skipping Comptroller._supportMarket (isListed (${bMaticConfig.symbol}): ${(await comptroller.markets(bMaticConfig.cToken)).isListed})`)
  }

  if(
    (await comptroller.markets(bMaticConfig.cToken)).collateralFactorMantissa.toString()
    != bMaticConfig.collateralFactorMantissa
  ) {
    let tx = await comptroller._setCollateralFactor(bMaticConfig.cToken, bMaticConfig.collateralFactorMantissa, {gasLimit: 2000000});
    tx = await tx.wait()
    console.log(`executing Comptroller._setCollateralFactor (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setCollateralFactor (collateralFactorMantissa (${bMaticConfig.symbol}): ${(await comptroller.markets(bMaticConfig.cToken)).collateralFactorMantissa.toString()})`)
  }

  if(
    (await comptroller.borrowCaps(bMaticConfig.cToken)).toString()
    != bMaticConfig.borrowCaps
  ) {
    let tx = await comptroller._setMarketBorrowCaps(bMaticConfig.borrowCaps);
    tx = await tx.wait()
    console.log(tx.events[0].args, `executing Comptroller._setMarketBorrowCaps (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setMarketBorrowCaps (borrowCaps (${bMaticConfig.symbol}): ${(await comptroller.borrowCaps(bMaticConfig.cToken)).toString()})`)
  }

  if((await comptroller.markets(bMatic.address)).isComped != bMaticConfig.isComped) {
    let tx = await comptroller._addCompMarkets([bMatic.address]);
    tx = await tx.wait()
    console.log(`executing Comptroller._addCompMarkets (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._addCompMarkets (isComped (${bMaticConfig.symbol}): ${(await comptroller.markets(bMatic.address)).isComped})`)
  }
};
export default func;
func.tags = ['ethMarket'];
func.dependencies = ['protocol']
