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

  let bEthConfig = config.marketsConfig.bETH;

  const args = [
    comptroller.address,
    HQLAModel.address,
    bEthConfig.initialExchangeRateMantissa,
    bEthConfig.name,
    bEthConfig.symbol,
    bEthConfig.decimals,
    deployer
  ]
  bEthConfig.name = 'CEther';

  const bEther = await deploy(bEthConfig.name, {
    contract: "CEther",
    from: deployer,
    log: true,
    args: args
  });
  bEthConfig.cToken = bEther.address;

  let tokenConfig = config.marketsConfig.bETH.tokenConfig;
  tokenConfig.cToken = bEthConfig.cToken;

  const i = await read('UniswapAnchoredView', 'cTokenIndex', bEthConfig.cToken);
  const token = await read('UniswapAnchoredView', 'tokens', i);
  if (token.cToken != bEthConfig.cToken) {
    await execute(
      'UniswapAnchoredView',
      {from: deployer, log: true},
      'addTokens',
      [tokenConfig]
    );
    await execute(
      'UniswapAnchoredView',
      {from: deployer, log: true, gasLimit: 750000},
      'getUnderlyingPrice',
      bEthConfig.cToken
    );
  }

  if((await read(bEthConfig.name, 'reserveFactorMantissa')).toString() != bEthConfig.reserveFactorMantissa) {
    await execute(
      bEthConfig.name,
      {from: deployer, log: true},
      '_setReserveFactor',
      bEthConfig.reserveFactorMantissa
    );
  } else {
    console.log(`skipping ${bEthConfig.name}._setReserveFactor (reserveFactorMantissa (${bEthConfig.symbol}): ${(await read(bEthConfig.name, 'reserveFactorMantissa')).toString()})`)
  }

  if(!(await comptroller.markets(bEthConfig.cToken)).isListed) {
    let tx = await comptroller._supportMarket(bEthConfig.cToken);
    tx = await tx.wait()
    console.log(`executing Comptroller._supportMarket (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(
      `skipping Comptroller._supportMarket (isListed (${bEthConfig.symbol}): ${(await comptroller.markets(bEthConfig.cToken)).isListed})`)
  }

  if(
    (await comptroller.markets(bEthConfig.cToken)).collateralFactorMantissa.toString()
    != bEthConfig.collateralFactorMantissa
  ) {
    let tx = await comptroller._setCollateralFactor(bEthConfig.cToken, bEthConfig.collateralFactorMantissa, {gasLimit: 2000000});
    tx = await tx.wait()
    console.log(`executing Comptroller._setCollateralFactor (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setCollateralFactor (collateralFactorMantissa (${bEthConfig.symbol}): ${(await comptroller.markets(bEthConfig.cToken)).collateralFactorMantissa.toString()})`)
  }

  if(
    (await comptroller.borrowCaps(bEthConfig.cToken)).toString()
    != bEthConfig.borrowCaps
  ) {
    let tx = await comptroller._setMarketBorrowCaps(bEthConfig.borrowCaps);
    tx = await tx.wait()
    console.log(tx.events[0].args, `executing Comptroller._setMarketBorrowCaps (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setMarketBorrowCaps (borrowCaps (${bEthConfig.symbol}): ${(await comptroller.borrowCaps(bEthConfig.cToken)).toString()})`)
  }

  if((await comptroller.markets(bEther.address)).isComped != bEthConfig.isComped) {
    let tx = await comptroller._addCompMarkets([bEther.address]);
    tx = await tx.wait()
    console.log(`executing Comptroller._addCompMarkets (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._addCompMarkets (isComped (${bEthConfig.symbol}): ${(await comptroller.markets(bEther.address)).isComped})`)
  }
};
export default func;
func.tags = ['ethMarket'];
func.dependencies = ['protocol']
