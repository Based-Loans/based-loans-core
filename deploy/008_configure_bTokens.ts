import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const config = CONFIG[hre.network.name];
  const comptroller = new hre.ethers.Contract(
    (await deployments.get('Unitroller')).address,
    (await deployments.get('Comptroller')).abi,
    await hre.ethers.provider.getSigner(deployer)
  );
  const bETH = await deployments.get('CEther');
  const bUSDC = await deployments.get('CErc20Immutable.bUSDC');
  const bWBTC = await deployments.get('CErc20Immutable.bWBTC');

  let bEthConfig = config.marketsConfig.bETH;
  bEthConfig.cToken = bETH.address;
  bEthConfig.name = 'CEther';
  let bUsdcConfig = config.marketsConfig.bUSDC;
  bUsdcConfig.cToken = bUSDC.address;
  bUsdcConfig.name = 'CErc20Immutable.bUSDC';
  let bWBtcConfig = config.marketsConfig.bWBTC;
  bWBtcConfig.cToken = bWBTC.address;
  bWBtcConfig.name = 'CErc20Immutable.bWBTC';
  const tokenConfigs = [bEthConfig, bUsdcConfig, bWBtcConfig];

  for (let i = 0; i < tokenConfigs.length; i++) {
    const bTokenConfig = tokenConfigs[i];

    if((await read(bTokenConfig.name, 'reserveFactorMantissa')).toString() != bTokenConfig.reserveFactorMantissa) {
      await execute(
        bTokenConfig.name,
        {from: deployer, log: true},
        '_setReserveFactor',
        bTokenConfig.reserveFactorMantissa
      );
    } else {
      console.log(`skipping ${bTokenConfig.name}._setReserveFactor (reserveFactorMantissa (${bTokenConfig.symbol}): ${(await read(bTokenConfig.name, 'reserveFactorMantissa')).toString()})`)
    }

    if(!(await comptroller.markets(bTokenConfig.cToken)).isListed) {
      let tx = await comptroller._supportMarket(bTokenConfig.cToken);
      tx = await tx.wait()
      console.log(`executing Comptroller._supportMarket (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
    } else {
      console.log(
        `skipping Comptroller._supportMarket (isListed (${bTokenConfig.symbol}): ${(await comptroller.markets(bTokenConfig.cToken)).isListed})`)
    }

    if(
      (await comptroller.markets(bTokenConfig.cToken)).collateralFactorMantissa.toString()
      != bTokenConfig.collateralFactorMantissa
    ) {
      let tx = await comptroller._setCollateralFactor(bTokenConfig.cToken, bTokenConfig.collateralFactorMantissa, {gasLimit: 2000000});
      tx = await tx.wait()
      console.log(`executing Comptroller._setCollateralFactor (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
    } else {
      console.log(`skipping Comptroller._setCollateralFactor (collateralFactorMantissa (${bTokenConfig.symbol}): ${(await comptroller.markets(bTokenConfig.cToken)).collateralFactorMantissa.toString()})`)
    }

    if(
      (await comptroller.borrowCaps(bTokenConfig.cToken)).toString()
      != bTokenConfig.borrowCaps
    ) {
      let tx = await comptroller._setMarketBorrowCaps(bTokenConfig.borrowCaps);
      tx = await tx.wait()
      console.log(tx.events[0].args, `executing Comptroller._setMarketBorrowCaps (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
    } else {
      console.log(`skipping Comptroller._setMarketBorrowCaps (borrowCaps (${bTokenConfig.symbol}): ${(await comptroller.borrowCaps(bTokenConfig.cToken)).toString()})`)
    }
  }
};
export default func;
func.tags = ['comptrollerConfig', 'alpha'];
